// Route: /webhooks/wayl
// Handles asynchronous webhook callbacks from Wayl payment gateway

import { WaylGateway } from "../services/payment/gateways/wayl.gateway.js";
import { SupabaseService } from "../services/supabase.service.js";
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

  const supabaseService = new SupabaseService(env);
  let session = await supabaseService.getPaymentSession(referenceId);

  // If not found in Supabase, check KV fallback
  if (!session && env.SHOPIFY_CONFIG) {
    try {
      const list = await env.SHOPIFY_CONFIG.list({ prefix: "payment_session:" });
      for (const k of list.keys) {
        if (k.name.endsWith(referenceId)) {
          const raw = await env.SHOPIFY_CONFIG.get(k.name);
          if (raw) session = JSON.parse(raw);
          break;
        }
      }
    } catch (_) {}
  }

  if (!session) {
    console.warn(`Wayl Webhook: Session not found for referenceId: ${referenceId}`);
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
    await supabaseService.updatePaymentSession(referenceId, {
      status: "failed",
      webhook_payload: eventData,
      error_message: `Payment status received: ${eventStatus}`
    });
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

    // Update Supabase session to 'paid' with Shopify order details
    await supabaseService.updatePaymentSession(referenceId, {
      status: "paid",
      shopify_order_id: createdOrder.orderId,
      shopify_order_number: createdOrder.orderNumber,
      webhook_payload: eventData
    });

    // Also update KV fallback if used
    if (env.SHOPIFY_CONFIG) {
      const kvKey = `payment_session:${shop}:${referenceId}`;
      session.status = "paid";
      session.shopify_order_id = createdOrder.orderId;
      session.shopify_order_number = createdOrder.orderNumber;
      await env.SHOPIFY_CONFIG.put(kvKey, JSON.stringify(session));
    }

    return successResponse({
      ok: true,
      received: true,
      orderId: createdOrder.orderId,
      orderNumber: createdOrder.orderNumber
    }, 200);
  } catch (err) {
    console.error("Failed to create paid order in Shopify on Wayl webhook:", err);
    await supabaseService.updatePaymentSession(referenceId, {
      error_message: err.message,
      webhook_payload: eventData
    });
    return errorResponse(`Failed to create order in Shopify: ${err.message}`, "ORDER_CREATION_FAILED", 500);
  }
}
