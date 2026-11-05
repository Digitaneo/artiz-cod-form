import { successResponse, errorResponse } from "../middleware/response.js";
import { ShippingService } from "../services/shipping.service.js";
import { CapiDispatcher } from "../services/tracking/capi-dispatcher.js";

export const DEFAULT_FORM_CONFIG = {
  addressMode: "standard",
  displayMode: "popup_modal", // popup_modal | slide_drawer | inline_form | sticky_bar
  buttonMode: "replace", // "replace" (Replace theme buttons) | "hijack" (Native Button Hijack)
  // --- UI Text Identifiers ---
  buttonText: "أطلب الآن",
  buttonSubtext: "🚚 نوصل طلباتك بسرعة وبموثوقية إلى باب بيتك",
  submitButtonText: "إكمال الدفع",
  formTitle: "معلومات الطلب",
  addToCartButtonText: "أضف إلى السلة",
  addingToCartText: "جاري الإضافة...",
  addedToCartText: "✓ تم الإضافة",
  cartCheckoutButtonText: "إتمام الطلب",
  submittingOrderText: "جاري الطلب...",
  outOfStockText: "غير متوفر",
  checkoutCartOnlyText: "إتمام طلب السلة",
  emptyCartText: "السلة فارغة",
  emptyCartAlert: "سلة التسوق فارغة، يرجى إضافة منتجات أولاً.",
  primaryColor: "#020a25",
  secondaryColor: "#ffffff",
  enableDiscounts: true,
  enableAffiliateTracking: true,
  noPaymentNotice: "نعتذر، المتجر لا يستقبل طلبات جديدة حالياً. سيتم استئناف استقبال الطلبات قريباً.",
  enableCartSummary: true,
  requiredFields: {
    name: true,
    phone: true,
    city: false,
    address: true,
    note: false
  },
  citiesList: ["الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", "مكناس", "وجدة", "القنيطرة", "تطوان", "الرياض", "جدة", "أخرى"],
  directBuyTrigger: true, // Auto attach to product Buy Now button
  cartDrawerTrigger: true, // Auto attach to cart checkout button
  showAddToCartButton: true, // Show or hide Add to Cart button in replace mode
  orderTag: "Artiz-COD",
  enableCustomThankYou: false,
  thankYouUrl: "",
  thankYouTitle: "🎉 شكراً لك! تم استلام طلبك بنجاح",
  thankYouMsg: "سيتواصل معك فريق خدمة العملاء خلال 24 ساعة لتأكيد موعد التسليم.",
  thankYouWhatsappBtn: true,
  thankYouWhatsappNumber: "",
  boosterConfig: {
    exitIntent: {
      enabled: false,
      couponCode: "",
      discountBadge: "10%",
      minOrderTotal: 0,
      title: "Hold on!",
      subtitle: "Congratulations! You've just unlocked a special discount!",
      btnAccept: "Complete order with discount",
      btnReject: "No thanks"
    }
  }
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
      if (shopData.settings?.formConfig && typeof shopData.settings.formConfig.buttonSubtext === "string") {
        formConfig.buttonSubtext = shopData.settings.formConfig.buttonSubtext;
      }
      formConfig.submitButtonText = formConfig.submitButtonText || formConfig.buttonText || DEFAULT_FORM_CONFIG.submitButtonText;

      // Sanitize boosterConfig strings against question marks or corrupt encoding
      if (formConfig.boosterConfig?.exitIntent) {
        const ei = formConfig.boosterConfig.exitIntent;
        const isQ = (str) => !str || /^\?+$/.test(String(str).replace(/\s+/g, ""));
        if (isQ(ei.title)) ei.title = "لأنك غالي علينا";
        if (isQ(ei.subtitle)) ei.subtitle = "تهانينا! لقد حصلت للتو على خصم خاص لطلبك!";
        if (isQ(ei.btnAccept)) ei.btnAccept = `قبول العرض وخصم ${ei.discountBadge || "10%"}`;
        if (isQ(ei.btnReject)) ei.btnReject = "لا، شكراً";
      }
    }

    const shippingService = new ShippingService(env);
    const shippingConfig = await shippingService.getConfig(shop);
    shippingConfig.shopCurrency = (rawData && JSON.parse(rawData)?.currency) || shippingConfig.shopCurrency || "IQD";

    const { PaymentManagerService } = await import("../services/payment/payment-manager.service.js");
    const paymentManager = new PaymentManagerService(env);
    const paymentConfig = await paymentManager.getStoreConfig(shop);

    const rawTracking = await CapiDispatcher.getStoreTrackingConfig(env, shop);
    const trackingConfig = CapiDispatcher.sanitizeForPublic(rawTracking);

    return successResponse(
      { formConfig, shippingConfig, paymentConfig, trackingConfig },
      200,
      {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    );
  } catch (err) {
    return errorResponse(err.message || "Failed to load form config", "CONFIG_LOAD_FAILED", 500);
  }
}
