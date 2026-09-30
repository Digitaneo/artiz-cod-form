import { ShippingService } from "../services/shipping.service.js";
import { getCurrentShop } from "../utils/session.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function shippingRatesSaveRoute(request, env) {
  try {
    const shop = await getCurrentShop(request, env);
    if (!shop) return errorResponse("Missing shop domain", "MISSING_SHOP", 400);

    const body = await request.json();
    const config = body.config || body;

    const shippingService = new ShippingService(env);
    const saved = await shippingService.saveConfig(shop, config);
    return successResponse({ config: saved });
  } catch (err) {
    return errorResponse(err.message || "Failed to save shipping config", "SHIPPING_SAVE_FAILED", 500);
  }
}
