// Route: /abandoned/delete
// Deletes a single abandoned checkout session or cleans up entries older than 24 hours
import { successResponse, errorResponse } from "../middleware/response.js";
import { getCurrentShop } from "../utils/session.js";

export async function abandonedDeleteRoute(request, env) {
  if (request.method !== "POST") {
    return errorResponse("Method not allowed", "METHOD_NOT_ALLOWED", 405);
  }

  try {
    let shop;
    try {
      shop = await getCurrentShop(request, env);
    } catch (_) {
      const url = new URL(request.url);
      shop = url.searchParams.get("shop");
    }

    if (!shop) {
      return errorResponse("Shop domain required", "MISSING_SHOP", 400);
    }

    const body = await request.json().catch(() => ({}));
    const { sessionId, sessionIds, olderThanHours } = body;

    if (!env.SHOPIFY_CONFIG) {
      return errorResponse("Storage unavailable", "STORAGE_ERROR", 500);
    }

    // 1. Delete multiple selected checkouts (Bulk Delete)
    if (Array.isArray(sessionIds) && sessionIds.length > 0) {
      let deletedCount = 0;
      for (const sid of sessionIds) {
        if (sid && typeof sid === "string") {
          await env.SHOPIFY_CONFIG.delete(`abandoned:${shop}:${sid}`);
          deletedCount++;
        }
      }
      return successResponse({ ok: true, deletedCount, sessionIds }, 200);
    }

    // 2. Delete single checkout
    if (sessionId) {
      await env.SHOPIFY_CONFIG.delete(`abandoned:${shop}:${sessionId}`);
      return successResponse({ ok: true, deletedSessionId: sessionId }, 200);
    }

    // 2. Batch cleanup older than X hours (default: 24h)
    if (olderThanHours) {
      const thresholdMs = Date.now() - (Number(olderThanHours) * 60 * 60 * 1000);
      const prefix = `abandoned:${shop}:`;
      const list = await env.SHOPIFY_CONFIG.list({ prefix, limit: 100 });
      let deletedCount = 0;

      for (const k of list.keys) {
        const raw = await env.SHOPIFY_CONFIG.get(k.name);
        if (raw) {
          try {
            const data = JSON.parse(raw);
            const createdMs = new Date(data.createdAt || 0).getTime();
            if (createdMs < thresholdMs) {
              await env.SHOPIFY_CONFIG.delete(k.name);
              deletedCount++;
            }
          } catch (_) {}
        }
      }

      return successResponse({ ok: true, deletedCount }, 200);
    }

    return errorResponse("Missing sessionId or olderThanHours parameter", "INVALID_PARAMS", 400);
  } catch (err) {
    return errorResponse(err.message || "Failed to delete abandoned checkout", "DELETE_FAILED", 500);
  }
}

