import { ShippingService } from "../services/shipping.service.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function publicShippingCalculateRoute(request, env) {
  try {
    const body = await request.json();
    const {
      shop,
      subtotal = 0,
      country = "",
      region = "",
      city = "",
      area = "",
      methodId = ""
    } = body;

    if (!shop) {
      return errorResponse("Missing shop domain", "MISSING_SHOP", 400);
    }

    const shippingService = new ShippingService(env);
    const result = await shippingService.calculateShipping(shop, {
      subtotal: Number(subtotal),
      country,
      region,
      city,
      area,
      methodId
    });

    return successResponse(result, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to calculate shipping", "SHIPPING_CALC_FAILED", 500);
  }
}
