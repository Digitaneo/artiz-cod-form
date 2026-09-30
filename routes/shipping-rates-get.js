import { ShippingService } from "../services/shipping.service.js";
import { getCurrentShop } from "../utils/session.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function shippingRatesGetRoute(request, env) {
  try {
    const shop = await getCurrentShop(request, env);
    if (!shop) return errorResponse("Missing shop domain", "MISSING_SHOP", 400);

    const shippingService = new ShippingService(env);
    const config = await shippingService.getConfig(shop);
    let shopCurrency = "MAD";
    try {
      const res = await shippingService.shopifyService.adminRequest(shop, "{ shop { currencyCode } }");
      if (res.data?.shop?.currencyCode) {
        shopCurrency = res.data.shop.currencyCode;
      }
    } catch (_) {}

    return successResponse({ config, shopCurrency });
  } catch (err) {
    return errorResponse(err.message || "Failed to get shipping config", "SHIPPING_GET_FAILED", 500);
  }
}
