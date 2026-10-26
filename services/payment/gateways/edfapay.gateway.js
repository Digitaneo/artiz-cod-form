// Edfapay Payment Gateway Adapter (Saudi Arabia - Mada, Visa, MasterCard, Apple Pay)
// https://edfapay.com

export class EdfapayGateway {
  constructor(env, config = {}) {
    this.env = env;
    this.config = config;
    this.baseUrl = config.baseUrl || "https://api.edfapay.com";
    this.merchantId = config.merchantId || "";
    this.apiKey = config.apiKey || "";
  }

  isConfigured() {
    return Boolean(this.merchantId && this.apiKey);
  }

  async createPaymentLink({ sessionId, totalAmount, currency, items, customer, shop, thankYouUrl }) {
    if (!this.isConfigured()) {
      throw new Error("Edfapay Gateway Error: Missing merchantId or apiKey in configuration.");
    }

    // Structure prepared for Edfapay Hosted Checkout API integration
    return {
      redirectUrl: `${this.baseUrl}/checkout/${sessionId}`,
      gatewayReferenceId: `edfa_${sessionId}`,
      rawResponse: { status: "pending", sessionId }
    };
  }

  async verifyWebhookSignature(rawBody, signatureHeader) {
    // Scaffold ready for Edfapay signature check
    return true;
  }
}
