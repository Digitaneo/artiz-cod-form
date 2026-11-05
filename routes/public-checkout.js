import { OrderService } from "../services/order.service.js";
import { PaymentManagerService } from "../services/payment/payment-manager.service.js";
import { CapiDispatcher } from "../services/tracking/capi-dispatcher.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function publicCheckoutRoute(request, env, ctx) {
  try {
    const body = await request.json();
    const {
      shop,
      customer,
      items,
      shippingPrice = 0,
      shippingTitle = "توصيل سريع لجميع المدن",
      note = "",
      discountCode = "",
      discountAmount = 0,
      discountPercent = 0,
      affiliate = {},
      customAttributes = [],
      paymentMethod = "cod",
      currency = "IQD"
    } = body;

    if (!shop) {
      return errorResponse("Missing shop domain", "MISSING_SHOP", 400);
    }

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return errorResponse("Missing required customer details (name, phone, address)", "MISSING_CUSTOMER_FIELDS", 400);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse("Cart is empty", "EMPTY_CART", 400);
    }

    const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
    const userAgent = request.headers.get("user-agent") || "";

    const orderService = new OrderService(env);
    const paymentManager = new PaymentManagerService(env);

    const result = await paymentManager.processCheckout({
      shop,
      customer,
      items,
      shippingPrice,
      note,
      options: {
        paymentMethod,
        currency,
        discountCode,
        discountAmount,
        discountPercent,
        affiliate,
        customAttributes,
        shippingTitle,
        orderTag: body.orderTag || "",
        clientDetails: {
          browser_ip: clientIp,
          user_agent: userAgent
        }
      },
      orderService
    });

    // Attach deduplication eventId and trigger background server-side tracking (CAPI)
    if (result && result.orderId) {
      const eventId = CapiDispatcher.generateEventId(shop, result.orderId);
      result.eventId = eventId;

      const totalNum = parseFloat(String(result.total || "0").replace(/[^0-9.]/g, "")) || 0;
      const capiTask = CapiDispatcher.dispatchPurchase(env, shop, {
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        totalValue: totalNum,
        currency: currency || "IQD",
        customer,
        items,
        clientIp,
        userAgent,
        eventId
      });

      if (ctx?.waitUntil) {
        ctx.waitUntil(capiTask);
      } else {
        capiTask.catch(e => console.warn("[CAPI Background]", e.message));
      }
    }

    return successResponse(result, 200);
  } catch (err) {
    const rawMsg = String(err?.message || "Failed to process checkout");
    if (rawMsg.includes("INVALID_PHONE") || (rawMsg.includes("phone") && rawMsg.includes("invalid"))) {
      return errorResponse("رقم الهاتف غير صالح، يرجى كتابة رقم هاتف صحيح للتوصيل.", "INVALID_PHONE", 422);
    }
    return errorResponse(rawMsg, "CHECKOUT_FAILED", 500);
  }
}
