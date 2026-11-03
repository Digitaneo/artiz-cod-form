// CAPI Dispatcher Orchestrator
// Dispatches server-side purchase events in parallel across configured providers
// Enforces 100% store isolation and error resilience

import { MetaCapiService } from "./meta-capi.js";
import { TikTokCapiService } from "./tiktok-capi.js";
import { SnapchatCapiService } from "./snapchat-capi.js";

export const DEFAULT_TRACKING_CONFIG = {
  google: {
    enabled: false,
    gscTag: "",
    gtmId: "",
    ga4Id: "",
    googleAdsId: "",
    googleAdsLabel: ""
  },
  meta: {
    enabled: false,
    pixelId: "",
    capiToken: "",
    testEventCode: ""
  },
  tiktok: {
    enabled: false,
    pixelId: "",
    eventsApiToken: "",
    testEventCode: ""
  },
  snapchat: {
    enabled: false,
    pixelId: "",
    capiToken: ""
  }
};

export class CapiDispatcher {
  /**
   * Loads tracking configuration strictly isolated by shop
   */
  static async getStoreTrackingConfig(env, shop) {
    if (!shop || !env?.SHOPIFY_CONFIG) {
      return { ...DEFAULT_TRACKING_CONFIG };
    }

    try {
      // 1. Try dedicated KV key first
      const dedicatedRaw = await env.SHOPIFY_CONFIG.get(`tracking:${shop}`);
      if (dedicatedRaw) {
        const parsed = JSON.parse(dedicatedRaw);
        return {
          google: { ...DEFAULT_TRACKING_CONFIG.google, ...(parsed.google || {}) },
          meta: { ...DEFAULT_TRACKING_CONFIG.meta, ...(parsed.meta || {}) },
          tiktok: { ...DEFAULT_TRACKING_CONFIG.tiktok, ...(parsed.tiktok || {}) },
          snapchat: { ...DEFAULT_TRACKING_CONFIG.snapchat, ...(parsed.snapchat || {}) }
        };
      }

      // 2. Fallback to main shop config
      const shopRaw = await env.SHOPIFY_CONFIG.get(shop);
      if (shopRaw) {
        const shopData = JSON.parse(shopRaw);
        const tracking = shopData.settings?.tracking || shopData.tracking || {};
        return {
          google: { ...DEFAULT_TRACKING_CONFIG.google, ...(tracking.google || {}) },
          meta: { ...DEFAULT_TRACKING_CONFIG.meta, ...(tracking.meta || {}) },
          tiktok: { ...DEFAULT_TRACKING_CONFIG.tiktok, ...(tracking.tiktok || {}) },
          snapchat: { ...DEFAULT_TRACKING_CONFIG.snapchat, ...(tracking.snapchat || {}) }
        };
      }
    } catch (err) {
      console.warn(`[CapiDispatcher] Failed to load tracking config for ${shop}:`, err.message);
    }

    return { ...DEFAULT_TRACKING_CONFIG };
  }

  /**
   * Returns sanitized tracking config safe to expose to storefront (no tokens!)
   */
  static sanitizeForPublic(config) {
    return {
      google: {
        enabled: Boolean(config.google?.enabled),
        gscTag: config.google?.gscTag || "",
        gtmId: config.google?.gtmId || "",
        ga4Id: config.google?.ga4Id || "",
        googleAdsId: config.google?.googleAdsId || "",
        googleAdsLabel: config.google?.googleAdsLabel || ""
      },
      meta: {
        enabled: Boolean(config.meta?.enabled),
        pixelId: config.meta?.pixelId || ""
      },
      tiktok: {
        enabled: Boolean(config.tiktok?.enabled),
        pixelId: config.tiktok?.pixelId || ""
      },
      snapchat: {
        enabled: Boolean(config.snapchat?.enabled),
        pixelId: config.snapchat?.pixelId || ""
      }
    };
  }

  /**
   * Generates a deterministic, unique event ID for deduplication
   */
  static generateEventId(shop, orderId) {
    const cleanShop = (shop || "store").split(".")[0].replace(/[^a-zA-Z0-9]/g, "");
    const cleanId = String(orderId || Date.now()).replace(/[^0-9]/g, "");
    return `order_${cleanId}_${cleanShop}`;
  }

  /**
   * Dispatches Purchase event to all enabled CAPI platforms in parallel
   */
  static async dispatchPurchase(env, shop, { orderId, orderNumber, totalValue, currency, customer, items, clientIp, userAgent, eventId }) {
    if (!shop || !orderId) return;

    try {
      const config = await this.getStoreTrackingConfig(env, shop);
      const finalEventId = eventId || this.generateEventId(shop, orderId);

      const params = {
        shop,
        orderId,
        orderNumber,
        totalValue,
        currency,
        customer,
        items,
        clientIp,
        userAgent,
        eventId: finalEventId
      };

      const meta = new MetaCapiService(config.meta);
      const tiktok = new TikTokCapiService(config.tiktok);
      const snapchat = new SnapchatCapiService(config.snapchat);

      const tasks = [];
      if (meta.enabled) tasks.push(meta.sendPurchaseEvent(params));
      if (tiktok.enabled) tasks.push(tiktok.sendPurchaseEvent(params));
      if (snapchat.enabled) tasks.push(snapchat.sendPurchaseEvent(params));

      if (tasks.length === 0) return { dispatched: 0 };

      const results = await Promise.allSettled(tasks);
      return {
        dispatched: tasks.length,
        results: results.map(r => r.status === "fulfilled" ? r.value : { ok: false, error: r.reason?.message })
      };
    } catch (err) {
      console.warn(`[CapiDispatcher] Error dispatching purchase for shop ${shop}:`, err.message);
      return { error: err.message };
    }
  }
}

