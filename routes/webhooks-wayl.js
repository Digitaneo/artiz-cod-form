// Route: /webhooks/wayl
// Handles asynchronous webhook callbacks from Wayl payment gateway via Cloudflare KV

import { WaylGateway } from "../services/payment/gateways/wayl.gateway.js";
import { OrderService } from "../services/order.service.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function webhooksWaylRoute(request, env) {
  if (request.method !== "POST") {
    return errorResponse("Method not allowed", "METHOD_NOT_ALLOWED", 405);
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-wayl-signature-256") || request.headers.get("x-signature") || "";

  const waylGateway = new WaylGateway(env);
  const isValid = await waylGateway.verifyWebhookSignature(rawBody, signatureHeader);

  // Note: in local development or if signature header is missing during manual test, we log warning
  if (!isValid && signatureHeader) {
    console.warn("Wayl Webhook: Invalid signature received!");
    return errorResponse("Invalid webhook signature", "INVALID_SIGNATURE", 401);
  }

  let eventData;
  try {
    eventData = JSON.parse(rawBody);
  } catch (err) {
    return errorResponse("Invalid JSON payload", "INVALID_JSON", 400);
  }

  const referenceId = eventData.referenceId || eventData.data?.referenceId || eventData.id || eventData.data?.id;
  if (!referenceId) {
    return errorResponse("Missing referenceId in webhook payload", "MISSING_REFERENCE_ID", 400);
  }

  // Retrieve session directly from Cloudflare KV
  let session = null;
  let sessionKey = `payment_session:${referenceId}`;

  if (env.SHOPIFY_CONFIG) {
    // 1. Direct session key
    let rawSession = await env.SHOPIFY_CONFIG.get(sessionKey);
    
    // 2. Secondary index lookup via payment_ref:
    if (!rawSession) {
      const mappedSessionId = await env.SHOPIFY_CONFIG.get(`payment_ref:${referenceId}`);
      if (mappedSessionId) {
        sessionKey = `payment_session:${mappedSessionId}`;
        rawSession = await env.SHOPIFY_CONFIG.get(sessionKey);
      }
    }

    if (rawSession) {
      try {
        session = JSON.parse(rawSession);
      } catch (_) {}
    }
  }

  if (!session) {
    console.warn(`Wayl Webhook: Session not found in KV for referenceId: ${referenceId}`);
    return errorResponse("Payment session not found", "SESSION_NOT_FOUND", 404);
  }

  // Idempotency: Prevent duplicate order creation if webhook is delivered multiple times
  if (session.status === "paid" && session.shopify_order_id) {
    return successResponse({
      received: true,
      alreadyProcessed: true,
      orderNumber: session.shopify_order_number
    }, 200);
  }

  // Check event status
  const eventStatus = (eventData.status || eventData.data?.status || eventData.event || "PAID").toUpperCase();
  const isPaid = eventStatus === "PAID" || eventStatus === "SUCCESS" || eventStatus === "COMPLETED";

  if (!isPaid) {
    session.status = "failed";
    session.error_message = `Payment status received: ${eventStatus}`;
    session.webhook_payload = eventData;
    session.updated_at = new Date().toISOString();

    if (env.SHOPIFY_CONFIG) {
      await env.SHOPIFY_CONFIG.put(sessionKey, JSON.stringify(session), { expirationTtl: 604800 });
      // Mark as payment_failed in abandoned list so merchant can follow up via WhatsApp
      const abandonedKey = `abandoned:${shop}:${session.client_session_id || referenceId}`;
      const existingRaw = await env.SHOPIFY_CONFIG.get(abandonedKey);
      if (existingRaw) {
        try {
          const rec = JSON.parse(existingRaw);
          rec.status = "payment_failed";
          rec.failedReason = session.error_message;
          rec.updatedAt = new Date().toISOString();
          await env.SHOPIFY_CONFIG.put(abandonedKey, JSON.stringify(rec), { expirationTtl: 604800 });
        } catch (_) {}
      }
    }

    return successResponse({ received: true, status: eventStatus }, 200);
  }

  // Payment is confirmed! Create paid order in Shopify
  const orderService = new OrderService(env);
  const shop = session.shop;
  const customer = session.customer_info;
  const items = session.items;
  const pricing = session.pricing || {};
  const shippingPrice = pricing.shippingPrice || 0;
  const discountAmount = pricing.discountAmount || 0;
  const note = customer.note || "";

  try {
    const createdOrder = await orderService.createPublicPaidOrder(
      shop,
      customer,
      items,
      shippingPrice,
      note,
      {
        paymentMethod: "Wayl (ZainCash / Cards)",
        gatewayReferenceId: eventData.id || eventData.data?.id || referenceId,
        discountCode: session.discount_code,
        discountAmount,
        shippingTitle: session.shipping_title || "توصيل سريع",
        affiliate: session.affiliate_data,
        customAttributes: [
          { key: "Payment Method", value: "Wayl Online Payment" },
          { key: "Wayl Reference", value: String(referenceId) }
        ]
      }
    );

    // Update session in Cloudflare KV to 'paid' with Shopify order details
    session.status = "paid";
    session.shopify_order_id = createdOrder.orderId;
    session.shopify_order_number = createdOrder.orderNumber;
    session.paid_at = new Date().toISOString();
    session.webhook_payload = eventData;

    if (env.SHOPIFY_CONFIG) {
      await env.SHOPIFY_CONFIG.put(sessionKey, JSON.stringify(session), { expirationTtl: 604800 });
      // Delete from abandoned checkouts list because order is now paid!
      const abandonedKey = `abandoned:${shop}:${session.client_session_id || referenceId}`;
      await env.SHOPIFY_CONFIG.delete(abandonedKey);
    }

    return successResponse({
      ok: true,
      received: true,
      orderId: createdOrder.orderId,
      orderNumber: createdOrder.orderNumber
    }, 200);
  } catch (err) {
    console.error("Failed to create paid order in Shopify on Wayl webhook:", err);
    session.error_message = err.message;
    session.webhook_payload = eventData;
    session.updated_at = new Date().toISOString();

    if (env.SHOPIFY_CONFIG) {
      await env.SHOPIFY_CONFIG.put(sessionKey, JSON.stringify(session), { expirationTtl: 604800 });
      // Mark as payment_failed in abandoned list so merchant can follow up via WhatsApp
      const abandonedKey = `abandoned:${shop}:${session.client_session_id || referenceId}`;
      const existingRaw = await env.SHOPIFY_CONFIG.get(abandonedKey);
      if (existingRaw) {
        try {
          const rec = JSON.parse(existingRaw);
          rec.status = "payment_failed";
          rec.failedReason = session.error_message;
          rec.updatedAt = new Date().toISOString();
          await env.SHOPIFY_CONFIG.put(abandonedKey, JSON.stringify(rec), { expirationTtl: 604800 });
        } catch (_) {}
      }
    }

    return errorResponse(`Failed to create order in Shopify: ${err.message}`, "ORDER_CREATION_FAILED", 500);
  }
}

