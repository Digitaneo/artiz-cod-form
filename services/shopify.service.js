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

  async adminRequest(shop, query, variables = {}) {
    const settings = await this.settingsRepo.getStoreConfig(shop);

    if (!settings) {
      throw new Error(`Shop not installed: ${shop}`);
    }

    if (!settings.accessToken) {
      throw new Error(`Missing Shopify Access Token for shop: ${shop}`);
    }

    const response = await fetch(this.getAdminUrl(shop), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

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

    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok) {
      const err = json.errors ? JSON.stringify(json.errors) : JSON.stringify(json);
      throw new Error(`Shopify REST API Error [${response.status}]: ${err}`);
    }

    return json;
  }
}
