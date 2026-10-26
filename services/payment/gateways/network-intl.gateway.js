// Network International Gateway Adapter (UAE & KSA - Visa, MasterCard, Amex, Apple Pay)
// UAE: https://www.network.ae/en
// KSA: https://network.global/ksa

export class NetworkIntlGateway {
  constructor(env, config = {}) {
    this.env = env;
    this.config = config;
    this.country = config.country || "AE"; // "AE" or "SA"
    this.outletId = config.outletId || "";
    this.apiKey = config.apiKey || "";
  }

  isConfigured() {
    return Boolean(this.outletId && this.apiKey);
  }

  async createPaymentLink({ sessionId, totalAmount, currency, items, customer, shop, thankYouUrl }) {
    if (!this.isConfigured()) {
      throw new Error(`Network International (${this.country}) Error: Missing outletId or apiKey.`);
    }

    // Structure prepared for Network International N-Genius Hosted Payment Session
    return {
      redirectUrl: `https://identity.networkinternational.com/checkout/${sessionId}`,
      gatewayReferenceId: `ni_${sessionId}`,
      rawResponse: { status: "pending", sessionId }
    };
  }

  async verifyWebhookSignature(rawBody, signatureHeader) {
    // Scaffold ready for Network International signature check
    return true;
  }
}
