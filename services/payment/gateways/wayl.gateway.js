// Wayl Payment Gateway Adapter (Iraq - ZainCash, AsiaHawala, Visa/MasterCard, FIB)
// Official API: https://api.thewayl.com

export class WaylGateway {
  constructor(env, config = {}) {
    this.env = env;
    this.config = config;
    this.baseUrl = "https://api.thewayl.com";
    this.accessToken = config.accessToken || env.WAYL_ACCESS_TOKEN || "";
    this.signingSecret = config.signingSecret || env.WAYL_SIGNING_SECRET || "76dde55168f7473b9a21b02412069987";
    this.customDomain = config.customDomain || env.WAYL_CUSTOM_DOMAIN || "https://pay.aladdinfitness.com";
    this.workerUrl = env.APP_URL || "https://artiz-cod-form.digitaneo.workers.dev";
  }

  /**
   * Initializes a hosted payment link with Wayl API
   */
  async createPaymentLink({ sessionId, totalAmount, currency, items, customer, shop, thankYouUrl }) {
    if (!this.accessToken) {
      throw new Error("Wayl Gateway Error: Missing WAYL_ACCESS_TOKEN.");
    }

    const cleanWorkerUrl = this.workerUrl.replace(/\/+$/, "");
    const webhookUrl = `${cleanWorkerUrl}/webhooks/wayl`;

    // Wayl expects total and line items
    const lineItem = items.map(item => ({
      label: String(item.title || "منتج").slice(0, 50),
      amount: Math.round(Number(item.price || 0) * Number(item.quantity || 1)),
      type: "increase"
    }));

    const payload = {
      referenceId: sessionId,
      total: Math.round(Number(totalAmount)),
      currency: currency || "IQD",
      lineItem: lineItem.length > 0 ? lineItem : [
        {
          label: "مشتريات المتجر",
          amount: Math.round(Number(totalAmount)),
          type: "increase"
        }
      ],
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

    // If custom domain is set (e.g. pay.aladdinfitness.com), map the checkout URL if needed
    if (this.customDomain && this.customDomain.trim().length > 0) {
      try {
        const parsed = new URL(finalCheckoutUrl);
        const customUrl = new URL(this.customDomain);
        parsed.hostname = customUrl.hostname;
        parsed.protocol = customUrl.protocol;
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
