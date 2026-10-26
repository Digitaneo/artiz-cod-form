// Supabase REST Service for Cloudflare Worker
// Operates securely via Server-to-Server Service Role Key

export class SupabaseService {
  constructor(env) {
    this.env = env;
    this.url = env.SUPABASE_URL ? env.SUPABASE_URL.replace(/\/+$/, "") : null;
    this.serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || null;
  }

  isConfigured() {
    return Boolean(this.url && this.serviceKey);
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "apikey": this.serviceKey,
      "Authorization": `Bearer ${this.serviceKey}`,
      "Prefer": "return=representation"
    };
  }

  async savePaymentSession(sessionData) {
    if (!this.isConfigured()) {
      // Graceful fallback to KV if Supabase is not yet configured
      if (this.env.SHOPIFY_CONFIG) {
        const key = `payment_session:${sessionData.shop}:${sessionData.client_session_id}`;
        await this.env.SHOPIFY_CONFIG.put(key, JSON.stringify(sessionData), { expirationTtl: 86400 * 7 });
      }
      return sessionData;
    }

    try {
      const res = await fetch(`${this.url}/rest/v1/store_payment_sessions`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(sessionData)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn("Supabase savePaymentSession warning:", errText);
        // Fallback to KV
        if (this.env.SHOPIFY_CONFIG) {
          const key = `payment_session:${sessionData.shop}:${sessionData.client_session_id}`;
          await this.env.SHOPIFY_CONFIG.put(key, JSON.stringify(sessionData), { expirationTtl: 86400 * 7 });
        }
      }
      return sessionData;
    } catch (err) {
      console.warn("Supabase savePaymentSession error:", err.message);
      if (this.env.SHOPIFY_CONFIG) {
        const key = `payment_session:${sessionData.shop}:${sessionData.client_session_id}`;
        await this.env.SHOPIFY_CONFIG.put(key, JSON.stringify(sessionData), { expirationTtl: 86400 * 7 });
      }
      return sessionData;
    }
  }

  async getPaymentSession(clientSessionId) {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const res = await fetch(
        `${this.url}/rest/v1/store_payment_sessions?client_session_id=eq.${encodeURIComponent(clientSessionId)}&select=*`,
        {
          method: "GET",
          headers: this.getHeaders()
        }
      );

      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (err) {
      console.warn("Supabase getPaymentSession error:", err.message);
      return null;
    }
  }

  async updatePaymentSession(clientSessionId, updateData) {
    updateData.updated_at = new Date().toISOString();

    if (!this.isConfigured()) {
      return null;
    }

    try {
      const res = await fetch(
        `${this.url}/rest/v1/store_payment_sessions?client_session_id=eq.${encodeURIComponent(clientSessionId)}`,
        {
          method: "PATCH",
          headers: this.getHeaders(),
          body: JSON.stringify(updateData)
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.warn("Supabase updatePaymentSession warning:", err);
      }
      return true;
    } catch (err) {
      console.warn("Supabase updatePaymentSession error:", err.message);
      return false;
    }
  }

  async getStorePaymentMethods(shop) {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const res = await fetch(
        `${this.url}/rest/v1/store_settings?shop=eq.${encodeURIComponent(shop)}&select=payment_methods`,
        {
          method: "GET",
          headers: this.getHeaders()
        }
      );

      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0].payment_methods : null;
    } catch (err) {
      console.warn("Supabase getStorePaymentMethods error:", err.message);
      return null;
    }
  }
}
