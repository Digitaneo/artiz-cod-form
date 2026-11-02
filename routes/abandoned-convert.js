// Route: /abandoned/convert
// Converts an unpaid abandoned checkout into an active Shopify COD order with 1 click
import { OrderService } from "../services/order.service.js";
import { successResponse, errorResponse } from "../middleware/response.js";
import { getCurrentShop } from "../utils/session.js";

export async function abandonedConvertRoute(request, env) {
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
    const sessionId = body.sessionId;

    if (!sessionId) {
      return errorResponse("Missing sessionId", "MISSING_SESSION_ID", 400);
    }

    if (!env.SHOPIFY_CONFIG) {
      return errorResponse("Storage unavailable", "STORAGE_ERROR", 500);
    }

    // 1. Fetch from KV session
    const abandonedKey = `abandoned:${shop}:${sessionId}`;
    const rawRecord = await env.SHOPIFY_CONFIG.get(abandonedKey);
    let sessionData = null;

    if (rawRecord) {
      try { sessionData = JSON.parse(rawRecord); } catch (_) {}
    }

    // Fallback to payment_session if needed
    if (!sessionData) {
      const rawPay = await env.SHOPIFY_CONFIG.get(`payment_session:${sessionId}`);
      if (rawPay) {
        try {
          const parsed = JSON.parse(rawPay);
          if (parsed.shop === shop) sessionData = parsed;
        } catch (_) {}
      }
    }

    if (!sessionData) {
      return errorResponse("Abandoned checkout session not found", "NOT_FOUND", 404);
    }

    if (sessionData.status === "converted" && sessionData.shopify_order_number) {
      return successResponse({
        ok: true,
        alreadyConverted: true,
        orderNumber: sessionData.shopify_order_number,
        orderId: sessionData.shopify_order_id
      }, 200);
    }

    // 2. Call OrderService to create real Shopify COD order
    const orderService = new OrderService(env);
    const customer = sessionData.customer || sessionData.customer_info || {};
    const items = sessionData.items || [];
    const pricing = sessionData.pricing || {};
    const shippingPrice = pricing.shippingPrice || 0;
    const note = customer.note || `تم استرجاع الطلب من السلات المتروكة (${sessionId})`;

    const createdOrder = await orderService.createPublicCODOrder(
      shop,
      customer,
      items,
      shippingPrice,
      note,
      {
        orderTag: "Artiz-Form",
        tags: ["Recovered-Abandoned-Cart", "Cash on Delivery", "Artiz-Form"],
        discountAmount: pricing.discountAmount || 0,
        shippingTitle: sessionData.shippingTitle || "توصيل سريع",
        customAttributes: [
          { key: "Recovered From", value: `Abandoned Checkout (${sessionId})` },
          { key: "Original Payment Attempt", value: sessionData.paymentMethod || "Electronic" }
        ]
      }
    );

    // 3. Update KV record to converted
    sessionData.status = "converted";
    sessionData.contactStatus = "converted";
    sessionData.shopify_order_id = createdOrder.orderId;
    sessionData.shopify_order_number = createdOrder.orderNumber;
    sessionData.convertedAt = new Date().toISOString();
    sessionData.updatedAt = new Date().toISOString();

    await env.SHOPIFY_CONFIG.put(abandonedKey, JSON.stringify(sessionData), { expirationTtl: 604800 });

    return successResponse({
      ok: true,
      orderNumber: createdOrder.orderNumber,
      orderId: createdOrder.orderId
    }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to convert abandoned checkout", "CONVERT_FAILED", 500);
  }
}
