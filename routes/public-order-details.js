import { OrderService } from "../services/order.service.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function publicOrderDetailsRoute(request, env) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const orderId = url.searchParams.get("order_id");

    if (!shop || !orderId) {
      return errorResponse("Missing shop or order_id parameter", "INVALID_PARAMS", 400);
    }

    const orderService = new OrderService(env);
    const order = await orderService.getPublicOrderDetails(shop, orderId);

    return successResponse({ order }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to fetch order details", "FETCH_ORDER_FAILED", 500);
  }
}
