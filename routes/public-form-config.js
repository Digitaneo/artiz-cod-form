import { successResponse, errorResponse } from "../middleware/response.js";
import { ShippingService } from "../services/shipping.service.js";

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
  citiesList: ["الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", "مكناس", "وجدة", "القنيطرة", "تطوان", "الرياض", "جدة", "أخرى"],
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
    let formConfig = { ...DEFAULT_FORM_CONFIG };
    if (rawData) {
      const shopData = JSON.parse(rawData);
      formConfig = {
        ...DEFAULT_FORM_CONFIG,
        ...(shopData.settings?.formConfig || shopData.formConfig || {})
      };
    }

    const shippingService = new ShippingService(env);
    const shippingConfig = await shippingService.getConfig(shop);
    let shopCurrency = "MAD";
    try {
      const res = await shippingService.shopifyService.adminRequest(shop, "{ shop { currencyCode } }");
      if (res.data?.shop?.currencyCode) {
        shopCurrency = res.data.shop.currencyCode;
      }
    } catch (_) {}
    shippingConfig.shopCurrency = shopCurrency;

    return successResponse({ formConfig, shippingConfig }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to load form config", "CONFIG_LOAD_FAILED", 500);
  }
}
