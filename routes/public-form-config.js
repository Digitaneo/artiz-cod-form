import { successResponse, errorResponse } from "../middleware/response.js";

export const DEFAULT_FORM_CONFIG = {
  displayMode: "popup_modal", // popup_modal | slide_drawer | inline_form | sticky_bar
  buttonText: "اشتري الآن - الدفع عند الاستلام",
  formTitle: "إتمام الطلب - الدفع عند الاستلام",
  primaryColor: "#008060",
  secondaryColor: "#ffffff",
  enableDiscounts: true,
  enableAffiliateTracking: true,
  enableCartSummary: true,
  requiredFields: {
    name: true,
    phone: true,
    city: true,
    address: true,
    note: false
  },
  citiesList: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "أخرى"],
  directBuyTrigger: true, // Auto attach to product Buy Now button
  cartDrawerTrigger: true // Auto attach to cart checkout button
};

export async function publicFormConfigRoute(request, env) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      return errorResponse("Missing shop parameter", "MISSING_SHOP", 400);
    }

    const rawData = await env.SHOPIFY_CONFIG.get(shop);
    if (!rawData) {
      return successResponse({ formConfig: DEFAULT_FORM_CONFIG }, 200);
    }

    const shopData = JSON.parse(rawData);
    const formConfig = {
      ...DEFAULT_FORM_CONFIG,
      ...(shopData.settings?.formConfig || shopData.formConfig || {})
    };

    return successResponse({ formConfig }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to load form config", "CONFIG_LOAD_FAILED", 500);
  }
}
