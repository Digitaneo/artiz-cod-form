import { SettingsRepository } from "../repositories/settings.repository.js";
import { VERSION_CONFIG } from "../config/version.js";

export class ShopifyService {
  constructor(env) {
    this.env = env;
    this.settingsRepo = new SettingsRepository(env);
  }

  getAdminUrl(shop) {
    return `https://${shop}/admin/api/${VERSION_CONFIG.shopifyApiVersion}/graphql.json`;
  }

  async refreshAccessToken(shop, settings) {
    if (!settings.refreshToken || !settings.clientId || !settings.clientSecret) {
      return null;
    }
    try {
      const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: settings.clientId,
          client_secret: settings.clientSecret,
          grant_type: "refresh_token",
          refresh_token: settings.refreshToken,
        }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        settings.accessToken = data.access_token;
        if (data.refresh_token) {
          settings.refreshToken = data.refresh_token;
        }
        await this.settingsRepo.saveStoreConfig(shop, settings);
        return data.access_token;
      }
    } catch (e) {
      console.error("[ShopifyService] Auto-refresh token failed:", e);
    }
    return null;
  }

  async adminRequest(shop, query, variables = {}) {
    const settings = await this.settingsRepo.getStoreConfig(shop);

    if (!settings) {
      throw new Error(`Shop not installed: ${shop}`);
    }

    if (!settings.accessToken) {
      throw new Error(`Missing Shopify Access Token for shop: ${shop}`);
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    };

    let response = await fetch(this.getAdminUrl(shop), options);
    let json = await response.json();

    if (response.status === 401 && settings.refreshToken) {
      const newToken = await this.refreshAccessToken(shop, settings);
      if (newToken) {
        options.headers["X-Shopify-Access-Token"] = newToken;
        response = await fetch(this.getAdminUrl(shop), options);
        json = await response.json();
      }
    }

    if (!response.ok) {
      throw new Error(`Shopify API HTTP ${response.status}: ${JSON.stringify(json)}`);
    }

    if (json.errors) {
      throw new Error(`Shopify GraphQL Error: ${JSON.stringify(json.errors)}`);
    }

    return json;
  }

  async restRequest(shop, endpoint, method = "GET", data = null) {
    const settings = await this.settingsRepo.getStoreConfig(shop);

    if (!settings) {
      throw new Error(`Shop not installed: ${shop}`);
    }

    if (!settings.accessToken) {
      throw new Error(`Missing Shopify Access Token for shop: ${shop}`);
    }

    const url = `https://${shop}/admin/api/${VERSION_CONFIG.shopifyApiVersion}/${endpoint}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
    };

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    let response = await fetch(url, options);
    let json = await response.json();

    if (response.status === 401 && settings.refreshToken) {
      const newToken = await this.refreshAccessToken(shop, settings);
      if (newToken) {
        options.headers["X-Shopify-Access-Token"] = newToken;
        response = await fetch(url, options);
        json = await response.json();
      }
    }

    if (!response.ok) {
      const err = json.errors ? JSON.stringify(json.errors) : JSON.stringify(json);
      throw new Error(`Shopify REST API Error [${response.status}]: ${err}`);
    }

    return json;
  }
}
