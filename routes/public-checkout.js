import { OrderService } from "../services/order.service.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function publicCheckoutRoute(request, env) {
  try {
    const body = await request.json();
    const {
      shop,
      customer,
      items,
      shippingPrice = 0,
      note = "",
      discountCode = "",
      affiliate = {},
      customAttributes = []
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
    const result = await orderService.createPublicCODOrder(shop, customer, items, shippingPrice, note, {
      discountCode,
      affiliate,
      customAttributes,
      clientDetails: {
        browser_ip: clientIp,
        user_agent: userAgent
      }
    });

    return successResponse(result, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to process checkout", "CHECKOUT_FAILED", 500);
  }
}
