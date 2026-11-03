// Meta (Facebook & Instagram) Conversions API (CAPI) Integration
// Direct Server-to-Server Purchase event with Deduplication support

import { sha256, hashPhone, hashEmail } from "./hash-helper.js";

export class MetaCapiService {
  constructor(config = {}) {
    this.pixelId = (config.pixelId || "").trim();
    this.capiToken = (config.capiToken || "").trim();
    this.testEventCode = (config.testEventCode || "").trim();
    this.enabled = Boolean(config.enabled && this.pixelId && this.capiToken);
  }

  async sendPurchaseEvent({ shop, orderId, orderNumber, totalValue, currency, customer, items, clientIp, userAgent, eventId }) {
    if (!this.enabled) return { skipped: true, reason: "Meta CAPI not configured or disabled" };

    try {
      const hashedPh = await hashPhone(customer?.phone);
      const hashedEm = await hashEmail(customer?.email);
      const hashedCt = customer?.city ? await sha256(customer.city) : "";

      const contents = (items || []).map(item => ({
        id: String(item.variantId || item.id || "").replace("gid://shopify/ProductVariant/", ""),
        quantity: Number(item.quantity || 1),
        item_price: Number(item.price || 0)
      }));

      const payload = {
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: `https://${shop}`,
            action_source: "website",
            user_data: {
              ...(hashedPh ? { ph: [hashedPh] } : {}),
              ...(hashedEm ? { em: [hashedEm] } : {}),
              ...(hashedCt ? { ct: [hashedCt] } : {}),
              ...(clientIp ? { client_ip_address: clientIp } : {}),
              ...(userAgent ? { client_user_agent: userAgent } : {})
            },
            custom_data: {
              currency: currency || "IQD",
              value: Number(totalValue || 0),
              order_id: String(orderNumber || orderId),
              content_type: "product",
              contents
            }
          }
        ]
      };

      if (this.testEventCode) {
        payload.test_event_code = this.testEventCode;
      }

      const response = await fetch(
        `https://graph.facebook.com/v19.0/${this.pixelId}/events?access_token=${encodeURIComponent(this.capiToken)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const resJson = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn(`[Meta CAPI] Event send failed for shop ${shop}:`, JSON.stringify(resJson));
        return { ok: false, error: resJson?.error?.message || "Meta API error", status: response.status };
      }

      return { ok: true, data: resJson };
    } catch (err) {
      console.warn(`[Meta CAPI] Network or processing error for shop ${shop}:`, err.message);
      return { ok: false, error: err.message };
    }
  }
}

