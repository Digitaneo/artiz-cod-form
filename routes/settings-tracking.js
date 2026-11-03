// Settings Tracking Route (Independent Modular Controller)
// Manages Google, Meta, TikTok, and Snapchat tracking configurations with strict store isolation

import { getCurrentShop } from "../utils/session.js";
import { CapiDispatcher, DEFAULT_TRACKING_CONFIG } from "../services/tracking/capi-dispatcher.js";
import { successResponse, errorResponse } from "../middleware/response.js";

async function resolveShop(request, env) {
  try {
    return await getCurrentShop(request, env);
  } catch (err) {
    const url = new URL(request.url);
    const shopParam = url.searchParams.get("shop");
    if (shopParam && /^[a-zA-Z0-9][a-zA-Z0-9\-]*(?:\.myshopify\.com|\.myshopify\.io)$/.test(shopParam)) {
      return shopParam;
    }
    throw err;
  }
}

export async function settingsTrackingGetRoute(request, env) {
  try {
    const shop = await resolveShop(request, env);
    const tracking = await CapiDispatcher.getStoreTrackingConfig(env, shop);
    return successResponse({ ok: true, shop, tracking }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to get tracking settings", "TRACKING_GET_FAILED", 500);
  }
}

export async function settingsTrackingSaveRoute(request, env) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    let shop;
    try {
      shop = await resolveShop(request, env);
    } catch (_) {
      shop = body.shop || url.searchParams.get("shop");
    }

    if (!shop) {
      return errorResponse("Missing shop domain", "MISSING_SHOP", 400);
    }

    const incoming = body.tracking || {};
    const tracking = {
      google: {
        enabled: Boolean(incoming.google?.enabled),
        gscTag: String(incoming.google?.gscTag || "").trim(),
        gtmId: String(incoming.google?.gtmId || "").trim(),
        ga4Id: String(incoming.google?.ga4Id || "").trim(),
        googleAdsId: String(incoming.google?.googleAdsId || "").trim(),
        googleAdsLabel: String(incoming.google?.googleAdsLabel || "").trim()
      },
      meta: {
        enabled: Boolean(incoming.meta?.enabled),
        pixelId: String(incoming.meta?.pixelId || "").trim(),
        capiToken: String(incoming.meta?.capiToken || "").trim(),
        testEventCode: String(incoming.meta?.testEventCode || "").trim()
      },
      tiktok: {
        enabled: Boolean(incoming.tiktok?.enabled),
        pixelId: String(incoming.tiktok?.pixelId || "").trim(),
        eventsApiToken: String(incoming.tiktok?.eventsApiToken || "").trim(),
        testEventCode: String(incoming.tiktok?.testEventCode || "").trim()
      },
      snapchat: {
        enabled: Boolean(incoming.snapchat?.enabled),
        pixelId: String(incoming.snapchat?.pixelId || "").trim(),
        capiToken: String(incoming.snapchat?.capiToken || "").trim()
      }
    };

    // 1. Save dedicated key for fast retrieval
    await env.SHOPIFY_CONFIG.put(`tracking:${shop}`, JSON.stringify(tracking));

    // 2. Also sync into main shop settings for unified backup
    const shopRaw = await env.SHOPIFY_CONFIG.get(shop);
    if (shopRaw) {
      const shopData = JSON.parse(shopRaw);
      shopData.settings = shopData.settings || {};
      shopData.settings.tracking = tracking;
      await env.SHOPIFY_CONFIG.put(shop, JSON.stringify(shopData));
    }

    return successResponse({ ok: true, shop, tracking, message: "Tracking settings saved successfully" }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to save tracking settings", "TRACKING_SAVE_FAILED", 500);
  }
}

