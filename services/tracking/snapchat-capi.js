// Snapchat Conversions API (CAPI) Integration
// Direct Server-to-Server PURCHASE event

import { hashPhone, hashEmail } from "./hash-helper.js";

export class SnapchatCapiService {
  constructor(config = {}) {
    this.pixelId = (config.pixelId || "").trim();
    this.capiToken = (config.capiToken || "").trim();
    this.enabled = Boolean(config.enabled && this.pixelId && this.capiToken);
  }

  async sendPurchaseEvent({ shop, orderId, orderNumber, totalValue, currency, customer, clientIp, userAgent, eventId }) {
    if (!this.enabled) return { skipped: true, reason: "Snapchat CAPI not configured or disabled" };

    try {
      const hashedPh = await hashPhone(customer?.phone);
      const hashedEm = await hashEmail(customer?.email);

      const payload = {
        version: "2.0",
        pixel_id: this.pixelId,
        event_type: "PURCHASE",
        event_conversion_type: "WEB",
        event_tag: eventId,
        timestamp: String(Math.floor(Date.now() / 1000)),
        client_dedup_id: eventId,
        transaction_id: String(orderNumber || orderId),
        price: Number(totalValue || 0),
        currency: currency || "IQD",
        ...(hashedPh ? { hashed_phone_number: hashedPh } : {}),
        ...(hashedEm ? { hashed_email: hashedEm } : {}),
        ...(clientIp ? { ip_address: clientIp } : {}),
        ...(userAgent ? { user_agent: userAgent } : {})
      };

      const response = await fetch("https://tr.snapchat.com/v2/conversion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.capiToken}`
        },
        body: JSON.stringify(payload)
      });

      const resJson = await response.json().catch(() => ({}));
      if (!response.ok || (resJson && resJson.status === "FAILED")) {
        console.warn(`[Snapchat CAPI] Event send failed for shop ${shop}:`, JSON.stringify(resJson));
        return { ok: false, error: resJson?.reason || "Snapchat API error", status: response.status };
      }

      return { ok: true, data: resJson };
    } catch (err) {
      console.warn(`[Snapchat CAPI] Network or processing error for shop ${shop}:`, err.message);
      return { ok: false, error: err.message };
    }
  }
}

