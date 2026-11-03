// TikTok Events API (CAPI) Integration
// Direct Server-to-Server CompletePayment event with Deduplication support

import { hashPhone, hashEmail } from "./hash-helper.js";

export class TikTokCapiService {
  constructor(config = {}) {
    this.pixelId = (config.pixelId || "").trim();
    this.eventsApiToken = (config.eventsApiToken || "").trim();
    this.testEventCode = (config.testEventCode || "").trim();
    this.enabled = Boolean(config.enabled && this.pixelId && this.eventsApiToken);
  }

  async sendPurchaseEvent({ shop, orderId, orderNumber, totalValue, currency, customer, items, clientIp, userAgent, eventId }) {
    if (!this.enabled) return { skipped: true, reason: "TikTok Events API not configured or disabled" };

    try {
      const hashedPh = await hashPhone(customer?.phone);
      const hashedEm = await hashEmail(customer?.email);

      const contents = (items || []).map(item => ({
        content_id: String(item.variantId || item.id || "").replace("gid://shopify/ProductVariant/", ""),
        content_type: "product",
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0)
      }));

      const payload = {
        event_source: "web",
        event_source_id: this.pixelId,
        data: [
          {
            event: "CompletePayment",
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            user: {
              ...(hashedPh ? { phone: hashedPh } : {}),
              ...(hashedEm ? { email: hashedEm } : {}),
              ...(clientIp ? { ip: clientIp } : {}),
              ...(userAgent ? { user_agent: userAgent } : {})
            },
            properties: {
              currency: currency || "IQD",
              value: Number(totalValue || 0),
              order_id: String(orderNumber || orderId),
              contents
            }
          }
        ]
      };

      if (this.testEventCode) {
        payload.test_event_code = this.testEventCode;
      }

      const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": this.eventsApiToken
        },
        body: JSON.stringify(payload)
      });

      const resJson = await response.json().catch(() => ({}));
      if (!response.ok || (resJson && resJson.code !== 0 && resJson.code !== undefined)) {
        console.warn(`[TikTok CAPI] Event send failed for shop ${shop}:`, JSON.stringify(resJson));
        return { ok: false, error: resJson?.message || "TikTok API error", status: response.status };
      }

      return { ok: true, data: resJson };
    } catch (err) {
      console.warn(`[TikTok CAPI] Network or processing error for shop ${shop}:`, err.message);
      return { ok: false, error: err.message };
    }
  }
}

