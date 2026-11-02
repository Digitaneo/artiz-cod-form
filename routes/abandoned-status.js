// Route: /abandoned/status
// Updates contact status (e.g. WhatsApp message sent) for an abandoned checkout
import { successResponse, errorResponse } from "../middleware/response.js";
import { getCurrentShop } from "../utils/session.js";

export async function abandonedStatusRoute(request, env) {
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
    const { sessionId, contactStatus } = body;

    if (!sessionId || !contactStatus) {
      return errorResponse("Missing sessionId or contactStatus", "INVALID_PARAMS", 400);
    }

    if (!env.SHOPIFY_CONFIG) {
      return errorResponse("Storage unavailable", "STORAGE_ERROR", 500);
    }

    const abandonedKey = `abandoned:${shop}:${sessionId}`;
    const rawRecord = await env.SHOPIFY_CONFIG.get(abandonedKey);

    if (!rawRecord) {
      return errorResponse("Abandoned checkout not found", "NOT_FOUND", 404);
    }

    const sessionData = JSON.parse(rawRecord);
    sessionData.contactStatus = contactStatus;
    sessionData.contactedAt = new Date().toISOString();
    sessionData.updatedAt = new Date().toISOString();

    await env.SHOPIFY_CONFIG.put(abandonedKey, JSON.stringify(sessionData), { expirationTtl: 604800 });

    return successResponse({ ok: true, contactStatus }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to update status", "STATUS_UPDATE_FAILED", 500);
  }
}
