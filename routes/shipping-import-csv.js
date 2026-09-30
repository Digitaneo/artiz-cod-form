import { ShippingService } from "../services/shipping.service.js";
import { getCurrentShop } from "../utils/session.js";
import { successResponse, errorResponse } from "../middleware/response.js";

export async function shippingImportCsvRoute(request, env) {
  try {
    const shop = await getCurrentShop(request, env);
    if (!shop) return errorResponse("Missing shop domain", "MISSING_SHOP", 400);

    const body = await request.json();
    const csvContent = body.csvContent;
    if (!csvContent) {
      return errorResponse("Missing csvContent", "MISSING_CSV", 400);
    }

    const shippingService = new ShippingService(env);
    const updated = await shippingService.importCsv(shop, csvContent);
    return successResponse({ config: updated, importedCount: updated.rates?.length || 0 });
  } catch (err) {
    return errorResponse(err.message || "Failed to import CSV", "CSV_IMPORT_FAILED", 500);
  }
}
