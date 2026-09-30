import { ShippingService } from "../services/shipping.service.js";
import { getCurrentShop } from "../utils/session.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function shippingImportShopifyRoute(request, env) {
  try {
    const shop = await getCurrentShop(request, env);
    if (!shop) return errorResponse("Missing shop domain", "MISSING_SHOP", 400);

    const shippingService = new ShippingService(env);
    const updated = await shippingService.importFromShopify(shop);
    return successResponse({ config: updated, message: "Successfully synced shipping zones from Shopify" });
  } catch (err) {
    return errorResponse(err.message || "Failed to sync shipping from Shopify", "SHOPIFY_SYNC_FAILED", 500);
  }
}
