// Wayl Payment Gateway Adapter (Iraq - ZainCash, AsiaHawala, Visa/MasterCard, FIB)
// Official API: https://api.thewayl.com

export class WaylGateway {
  constructor(env, config = {}) {
    this.env = env;
    this.config = config;
    this.baseUrl = "https://api.thewayl.com";
    this.accessToken = (config.accessToken && String(config.accessToken).trim()) || env.WAYL_ACCESS_TOKEN || "";
    this.signingSecret = (config.signingSecret && String(config.signingSecret).trim()) || env.WAYL_SIGNING_SECRET || "";
    this.customDomain = (config.customDomain && String(config.customDomain).trim()) || env.WAYL_CUSTOM_DOMAIN || "";
    this.workerUrl = env.APP_URL || "https://aladdin-quick-order.digitaneo.workers.dev";
  }

  /**
   * Initializes a hosted payment link with Wayl API
   */
  async createPaymentLink({
    sessionId,
    totalAmount,
    currency,
    items = [],
    customer = {},
    shop = "",
    thankYouUrl = "",
    shippingPrice = 0,
    shippingTitle = "الشحن والتوصيل",
    discountAmount = 0,
    discountCode = ""
  }) {
    if (!this.accessToken) {
      throw new Error("Wayl Gateway Error: Missing WAYL_ACCESS_TOKEN.");
    }

    const cleanWorkerUrl = this.workerUrl.replace(/\/+$/, "");
    const webhookUrl = `${cleanWorkerUrl}/webhooks/wayl`;

    // 1. Build line items array for all purchased items
    const lineItem = items.map(item => {
      const unitPrice = Math.round(Number(item.price || 0));
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      return {
        label: String(item.title || "منتج").trim().slice(0, 50),
        amount: Math.round(unitPrice * qty),
        type: "increase"
      };
    });

    // 2. Add shipping as an increase line item if shippingPrice > 0
    const numShipping = Math.round(Number(shippingPrice || 0));
    if (numShipping > 0) {
      lineItem.push({
        label: String(shippingTitle || "الشحن والتوصيل").trim().slice(0, 50),
        amount: numShipping,
        type: "increase"
      });
    }

    // 3. Add discount as a decrease line item if discountAmount > 0
    const numDiscount = Math.round(Number(discountAmount || 0));
    if (numDiscount > 0) {
      lineItem.push({
        label: String(discountCode ? `خصم (${discountCode})` : "كود الخصم").trim().slice(0, 50),
        amount: numDiscount,
        type: "decrease"
      });
    }

    // Fallback if lineItem is empty
    if (lineItem.length === 0) {
      lineItem.push({
        label: "مشتريات المتجر",
        amount: Math.round(Number(totalAmount || 0)),
        type: "increase"
      });
    }

    // 4. Calculate exact sum of line items: sum(increases) - sum(decreases)
    const netSummation = lineItem.reduce((acc, item) => {
      const amt = Math.round(Number(item.amount || 0));
      return item.type === "decrease" ? acc - amt : acc + amt;
    }, 0);

    const targetTotal = Math.max(0, Math.round(Number(totalAmount)));

    // Reconcile any rounding delta so Wayl's server never rejects the summation check!
    let finalTotal = targetTotal;
    if (netSummation !== targetTotal) {
      const delta = targetTotal - netSummation;
      // Adjust the first item to make the equation 100% exact
      if (lineItem.length > 0 && lineItem[0].type === "increase") {
        lineItem[0].amount = Math.max(0, lineItem[0].amount + delta);
        finalTotal = targetTotal;
      } else {
        finalTotal = Math.max(0, netSummation);
      }
    }

    const payload = {
      referenceId: sessionId,
      total: finalTotal,
      currency: currency || "IQD",
      lineItem,
      webhookUrl,
      webhookSecret: this.signingSecret,
      redirectionUrl: thankYouUrl || `https://${shop}`
    };

    const res = await fetch(`${this.baseUrl}/api/v1/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WAYL-AUTHENTICATION": this.accessToken
      },
      body: JSON.stringify(payload)
    });

    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (_) {
      throw new Error(`Wayl API responded with invalid JSON: ${responseText.slice(0, 200)}`);
    }

    if (!res.ok || data.status === "error" || !data.data?.url) {
      const errMsg = data.message || data.error || JSON.stringify(data);
      throw new Error(`Wayl payment link creation failed: ${errMsg}`);
    }

    let finalCheckoutUrl = data.data.url;

    // If custom domain is set (e.g. pay.aladdinfitness.com), map the checkout URL safely
    const rawCustom = String(this.customDomain || "").trim();
    if (rawCustom.length > 0) {
      try {
        const cleanDomain = rawCustom.replace(/\.+$/, "").replace(/\/+$/, "");
        const formattedDomain = cleanDomain.startsWith("http") ? cleanDomain : `https://${cleanDomain}`;
        const parsed = new URL(finalCheckoutUrl);
        const customUrl = new URL(formattedDomain);
        parsed.hostname = customUrl.hostname;
        parsed.protocol = customUrl.protocol;
        if (customUrl.port) parsed.port = customUrl.port;
        finalCheckoutUrl = parsed.toString();
      } catch (_) {
        // Fallback to original checkout URL from Wayl
      }
    }

    return {
      redirectUrl: finalCheckoutUrl,
      gatewayReferenceId: data.data.id || data.data.linkId || sessionId,
      rawResponse: data
    };
  }

  /**
   * Cryptographically verifies the x-wayl-signature-256 header using HMAC-SHA256
   */
  async verifyWebhookSignature(rawBody, signatureHeader) {
    if (!signatureHeader || !this.signingSecret) {
      return false;
    }

    try {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(this.signingSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
      );

      // Convert hex signature to Uint8Array
      const cleanSignatureHex = signatureHeader.trim().toLowerCase();
      const match = cleanSignatureHex.match(/.{1,2}/g);
      if (!match) return false;
      const signatureBytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));

      return await crypto.subtle.verify(
        "HMAC",
        key,
        signatureBytes,
        enc.encode(rawBody)
      );
    } catch (err) {
      console.warn("Wayl signature verification error:", err.message);
      return false;
    }
  }
}
