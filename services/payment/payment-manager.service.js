// Unified Payment Manager Service (Orchestrator)
// Selects appropriate payment gateway, enforces isolation and logging via Cloudflare KV

import { CodGateway } from "./gateways/cod.gateway.js";
import { WaylGateway } from "./gateways/wayl.gateway.js";
import { EdfapayGateway } from "./gateways/edfapay.gateway.js";
import { NetworkIntlGateway } from "./gateways/network-intl.gateway.js";

export const DEFAULT_PAYMENT_METHODS = {
  enabledMethods: ["cod"],
  defaultMethod: "cod",
  methods: {
    cod: {
      id: "cod",
      enabled: true,
      title: "الدفع عند الاستلام",
      subtitle: "💵 ادفع بكل أمان وقت استلام المنتج.",
      badge: "نقدي",
      icon: "cash"
    },
    wayl: {
      id: "wayl",
      enabled: false,
      title: "دفع إلكتروني - WAYL",
      subtitle: "دفع آمن — SSL & 3D Secure",
      badge: "دفع آمن 100%",
      icon: "electronic",
      customDomain: ""
    },
    edfapay: {
      id: "edfapay",
      enabled: false,
      title: "ادفع باي (Edfapay السعودية)",
      subtitle: "مدى، فيزا، ماستركارد، أبل باي",
      badge: "السعودية",
      icon: "card"
    },
    network_intl: {
      id: "network_intl",
      enabled: false,
      title: "Network International",
      subtitle: "الدفع ببطاقات الائتمان (الإمارات والسعودية)",
      badge: "دولي",
      icon: "card"
    }
  }
};

export class PaymentManagerService {
  constructor(env) {
    this.env = env;
  }

  async getStoreConfig(shop) {
    if (!shop || !this.env.SHOPIFY_CONFIG) {
      return DEFAULT_PAYMENT_METHODS;
    }

    let customMethods = null;
    try {
      const raw = await this.env.SHOPIFY_CONFIG.get(shop);
      if (raw) {
        const parsed = JSON.parse(raw);
        customMethods = parsed.settings?.formConfig?.paymentMethods || parsed.formConfig?.paymentMethods || null;
      }
    } catch (err) {
      console.warn(`PaymentManager: failed to load store config for ${shop}:`, err.message);
    }

    // Legacy/alternate key check: payment_methods:{shop}
    if (!customMethods) {
      try {
        const rawAlt = await this.env.SHOPIFY_CONFIG.get(`payment_methods:${shop}`);
        if (rawAlt) customMethods = JSON.parse(rawAlt);
      } catch (_) { }
    }

    if (!customMethods) {
      return DEFAULT_PAYMENT_METHODS;
    }

    const mergedMethods = {
      ...DEFAULT_PAYMENT_METHODS.methods,
      ...(customMethods.methods || customMethods)
    };
    delete mergedMethods.whatsapp;

    if (mergedMethods.wayl) {
      if (!mergedMethods.wayl.title || mergedMethods.wayl.title.includes("MasterCard") || mergedMethods.wayl.title.includes("بوابة")) {
        mergedMethods.wayl.title = "دفع إلكتروني - WAYL";
      }
      if (!mergedMethods.wayl.subtitle || (mergedMethods.wayl.subtitle.includes("3D Secure") && !mergedMethods.wayl.subtitle.includes("SSL"))) {
        mergedMethods.wayl.subtitle = "دفع آمن — SSL & 3D Secure";
      }
    }

    if (mergedMethods.cod && mergedMethods.cod.subtitle && mergedMethods.cod.subtitle.includes("نقداً عند استلام")) {
      mergedMethods.cod.subtitle = "💵 ادفع بكل أمان وقت استلام المنتج.";
    }

    // Determine active enabled methods:
    // Any method where enabled is explicitly true
    const activeEnabledKeys = Object.keys(mergedMethods).filter(k => mergedMethods[k]?.enabled === true);

    // Also include any explicitly listed in customMethods.enabledMethods if not disabled
    if (Array.isArray(customMethods.enabledMethods)) {
      for (const m of customMethods.enabledMethods) {
        if (m !== "whatsapp" && mergedMethods[m] && mergedMethods[m].enabled !== false) {
          if (!activeEnabledKeys.includes(m)) activeEnabledKeys.push(m);
        }
      }
    }

    const noPaymentNotice = customMethods.noPaymentNotice || "نعتذر، المتجر لا يستقبل طلبات جديدة حالياً. سيتم استئناف استقبال الطلبات قريباً.";

    let defaultMethod = customMethods.defaultMethod;
    if (!defaultMethod || !activeEnabledKeys.includes(defaultMethod)) {
      defaultMethod = activeEnabledKeys[0] || "";
    }

    return {
      enabledMethods: activeEnabledKeys,
      defaultMethod,
      noPaymentNotice,
      methods: mergedMethods
    };
  }

  getGateway(methodKey, storeConfig = {}) {
    const methodCfg = storeConfig.methods?.[methodKey] || {};

    switch (methodKey) {
      case "wayl":
        return new WaylGateway(this.env, methodCfg);
      case "edfapay":
        return new EdfapayGateway(this.env, methodCfg);
      case "network_intl":
        return new NetworkIntlGateway(this.env, methodCfg);
      case "cod":
      default:
        return new CodGateway(this.env, methodCfg);
    }
  }

  /**
   * Main checkout orchestrator for all payment methods
   */
  async processCheckout({ shop, customer, items, shippingPrice = 0, note = "", options = {}, orderService }) {
    const paymentMethod = options.paymentMethod || "cod";
    const storeConfig = await this.getStoreConfig(shop);
    const gateway = this.getGateway(paymentMethod, storeConfig);

    // 1. COD Workflow (Instant DraftOrder & completion)
    if (paymentMethod === "cod") {
      const orderResult = await gateway.processCheckout({
        orderService,
        shop,
        customer,
        items,
        shippingPrice,
        note,
        options: {
          ...options,
          tags: ["Cash on Delivery"]
        }
      });
      return {
        paymentMethod: "cod",
        ...orderResult
      };
    }

    // 2. Electronic Payment (Wayl / Edfapay / Network Intl)
    const sessionId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const subtotal = items.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
    const totalAmount = Math.max(0, subtotal + Number(shippingPrice || 0) - Number(options.discountAmount || 0));
    const currency = options.currency || "IQD";

    // Save session in Cloudflare KV with status 'pending_payment' (7 days TTL)
    const sessionRecord = {
      shop,
      client_session_id: sessionId,
      payment_method: paymentMethod,
      status: "pending_payment",
      customer_info: customer,
      items,
      pricing: {
        subtotal,
        shippingPrice,
        discountAmount: options.discountAmount || 0,
        total: totalAmount,
        currency
      },
      shipping_title: options.shippingTitle || "توصيل سريع",
      discount_code: options.discountCode || "",
      affiliate_data: options.affiliate || {},
      created_at: new Date().toISOString()
    };

    if (this.env.SHOPIFY_CONFIG) {
      await this.env.SHOPIFY_CONFIG.put(
        `payment_session:${sessionId}`,
        JSON.stringify(sessionRecord),
        { expirationTtl: 604800 }
      );
    }

    const thankYouUrl = `https://${shop}/pages/thank-you?session_id=${sessionId}&shop=${shop}`;

    const linkResult = await gateway.createPaymentLink({
      sessionId,
      totalAmount,
      currency,
      items,
      customer,
      shop,
      thankYouUrl,
      shippingPrice,
      shippingTitle: options.shippingTitle || "الشحن والتوصيل",
      discountAmount: options.discountAmount || 0,
      discountCode: options.discountCode || ""
    });

    // Map alternate gateway reference ID to sessionId in KV if different
    if (linkResult.gatewayReferenceId && linkResult.gatewayReferenceId !== sessionId && this.env.SHOPIFY_CONFIG) {
      await this.env.SHOPIFY_CONFIG.put(
        `payment_ref:${linkResult.gatewayReferenceId}`,
        sessionId,
        { expirationTtl: 604800 }
      );
    }

    return {
      paymentMethod,
      sessionId,
      redirectUrl: linkResult.redirectUrl,
      total: `${totalAmount} ${currency}`
    };
  }
}

