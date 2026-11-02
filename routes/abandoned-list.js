// Route: /abandoned/list
// Single Source of Truth for fetching and analyzing abandoned checkout sessions per store
import { successResponse, errorResponse } from "../middleware/response.js";
import { getCurrentShop } from "../utils/session.js";

export async function abandonedListRoute(request, env) {
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

    if (!env.SHOPIFY_CONFIG) {
      return successResponse({
        stats: {
          totalAbandoned: 0,
          potentialLostValue: 0,
          abandonedToday: 0,
          contactedCount: 0,
          currency: "IQD"
        },
        checkouts: []
      }, 200);
    }

    // 1. Multi-Store Isolation: fetch only keys for this shop prefix
    const prefix = `abandoned:${shop}:`;
    const listResult = await env.SHOPIFY_CONFIG.list({ prefix, limit: 100 });

    const checkouts = [];
    let totalAbandoned = 0;
    let potentialLostValue = 0;
    let abandonedToday = 0;
    let contactedCount = 0;
    let currency = "IQD";

    const todayStr = new Date().toISOString().split("T")[0];

    for (const key of listResult.keys) {
      const raw = await env.SHOPIFY_CONFIG.get(key.name);
      if (!raw) continue;

      try {
        const item = JSON.parse(raw);
        if (item.status === "paid") continue; // Exclude paid orders

        const itemDateStr = item.createdAt ? item.createdAt.split("T")[0] : "";
        const itemTotal = Number(item.pricing?.total || 0);
        if (item.pricing?.currency) currency = item.pricing.currency;

        totalAbandoned += 1;
        if (item.status !== "converted") {
          potentialLostValue += itemTotal;
        }

        if (itemDateStr === todayStr) {
          abandonedToday += 1;
        }

        if (item.contactStatus === "contacted" || item.contactStatus === "converted") {
          contactedCount += 1;
        }

        checkouts.push({
          sessionId: item.sessionId,
          status: item.status || "pending_payment",
          contactStatus: item.contactStatus || "not_contacted",
          contactedAt: item.contactedAt || null,
          contactMethod: item.contactMethod || null,
          templateUsed: item.templateUsed || null,
          customer: item.customer || {},
          items: item.items || [],
          pricing: item.pricing || { total: itemTotal, currency },
          paymentMethod: item.paymentMethod || "electronic",
          shippingTitle: item.shippingTitle || "توصيل سريع",
          convertedOrderNumber: item.shopify_order_number || null,
          convertedOrderId: item.shopify_order_id || null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt || item.createdAt
        });
      } catch (_) {}
    }

    // Sort by newest first
    checkouts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return successResponse({
      stats: {
        totalAbandoned,
        potentialLostValue,
        abandonedToday,
        contactedCount,
        currency
      },
      checkouts
    }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to list abandoned checkouts", "ABANDONED_LIST_FAILED", 500);
  }
}

