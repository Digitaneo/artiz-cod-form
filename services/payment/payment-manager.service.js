// Unified Payment Manager Service (Orchestrator)
// Selects appropriate payment gateway, enforces isolation and logging

import { CodGateway } from "./gateways/cod.gateway.js";
import { WaylGateway } from "./gateways/wayl.gateway.js";
import { WhatsAppGateway } from "./gateways/whatsapp.gateway.js";
import { EdfapayGateway } from "./gateways/edfapay.gateway.js";
import { NetworkIntlGateway } from "./gateways/network-intl.gateway.js";
import { SupabaseService } from "../supabase.service.js";

export const DEFAULT_PAYMENT_METHODS = {
  enabledMethods: ["cod", "wayl", "whatsapp"],
  defaultMethod: "cod",
  methods: {
    cod: {
      id: "cod",
      enabled: true,
      title: "الدفع عند الاستلام",
      subtitle: "ادفع نقداً عند استلام شحنتك من المندوب",
      badge: "نقدي",
      icon: "cash"
    },
    wayl: {
      id: "wayl",
      enabled: true,
      title: "دفع إلكتروني فوري وآمن",
      subtitle: "زين كاش، آسيا حوالة، فيزا وماستركارد، FIB",
      badge: "دفع آمن 100%",
      icon: "electronic",
      customDomain: "https://pay.aladdinfitness.com"
    },
    whatsapp: {
      id: "whatsapp",
      enabled: true,
      title: "طلب مباشر عبر واتساب",
      subtitle: "تأكيد الطلب والتفاصيل مباشرة مع خدمة العملاء",
      badge: "تواصل فوري",
      icon: "whatsapp",
      phone: "9647700000000"
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
    this.supabaseService = new SupabaseService(env);
  }

  async getStoreConfig(shop) {
    let customMethods = null;
    try {
      customMethods = await this.supabaseService.getStorePaymentMethods(shop);
    } catch (_) {}

    if (!customMethods && this.env.SHOPIFY_CONFIG) {
      try {
        const raw = await this.env.SHOPIFY_CONFIG.get(`payment_methods:${shop}`);
        if (raw) customMethods = JSON.parse(raw);
      } catch (_) {}
    }

    if (!customMethods) {
      return DEFAULT_PAYMENT_METHODS;
    }

    return {
      enabledMethods: customMethods.enabledMethods || DEFAULT_PAYMENT_METHODS.enabledMethods,
      defaultMethod: customMethods.defaultMethod || DEFAULT_PAYMENT_METHODS.defaultMethod,
      methods: {
        ...DEFAULT_PAYMENT_METHODS.methods,
        ...(customMethods.methods || customMethods)
      }
    };
  }

  getGateway(methodKey, storeConfig = {}) {
    const methodCfg = storeConfig.methods?.[methodKey] || {};

    switch (methodKey) {
      case "wayl":
        return new WaylGateway(this.env, methodCfg);
      case "whatsapp":
        return new WhatsAppGateway(this.env, methodCfg);
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

    // 1. COD Workflow (Unchanged, instant DraftOrder & completion)
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
          tags: ["Cash on Delivery", "Artiz COD OS"]
        }
      });
      return {
        paymentMethod: "cod",
        ...orderResult
      };
    }

    // 2. WhatsApp Direct Order Workflow
    if (paymentMethod === "whatsapp") {
      const orderResult = await orderService.createPublicCODOrder(
        shop,
        customer,
        items,
        shippingPrice,
        note,
        {
          ...options,
          tags: ["WhatsApp Order", "Cash on Delivery", "Artiz COD OS"]
        }
      );

      const subtotal = items.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
      const totalAmount = subtotal + Number(shippingPrice || 0) - Number(options.discountAmount || 0);

      const { whatsappUrl } = gateway.generateWhatsAppLink({
        orderNumber: orderResult.orderNumber,
        customer,
        items,
        total: totalAmount,
        currency: orderResult.total?.split(" ")[1] || "IQD",
        shippingPrice,
        note
      });

      return {
        paymentMethod: "whatsapp",
        ...orderResult,
        whatsappUrl
      };
    }

    // 3. Electronic Payment (Wayl / Edfapay / Network Intl)
    const sessionId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const subtotal = items.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
    const totalAmount = Math.max(0, subtotal + Number(shippingPrice || 0) - Number(options.discountAmount || 0));
    const currency = options.currency || "IQD";

    // Save session in Supabase with status 'pending_payment'
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
      affiliate_data: options.affiliate || {}
    };

    await this.supabaseService.savePaymentSession(sessionRecord);

    const thankYouUrl = `https://${shop}/pages/thank-you?session_id=${sessionId}&shop=${shop}`;

    const linkResult = await gateway.createPaymentLink({
      sessionId,
      totalAmount,
      currency,
      items,
      customer,
      shop,
      thankYouUrl
    });

    // Update gateway reference ID in database
    if (linkResult.gatewayReferenceId) {
      await this.supabaseService.updatePaymentSession(sessionId, {
        gateway_reference_id: linkResult.gatewayReferenceId
      });
    }

    return {
      paymentMethod,
      sessionId,
      redirectUrl: linkResult.redirectUrl,
      total: `${totalAmount} ${currency}`
    };
  }
}
