import { KVRepository } from "../repositories/kv.repository.js";

export class IntegrationService {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  async getIntegrations(shop) {
    const key = `integrations:${shop}`;
    return await this.kvRepo.get(key) || {
      shop,
      meta: { enabled: false, pixelId: null },
      google: { enabled: false, measurementId: null },
      tiktok: { enabled: false, pixelId: null },
      whatsapp: { enabled: false, apiKey: null, phoneNumber: null },
      webhook: { enabled: false, url: null }
    };
  }

  async saveIntegrations(shop, integrations) {
    const key = `integrations:${shop}`;
    await this.kvRepo.put(key, integrations);
    return integrations;
  }

  async firePixelEvent(shop, eventName, eventData) {
    const integrations = await this.getIntegrations(shop);
    const results = [];

    if (integrations.meta?.enabled && integrations.meta?.pixelId) {
      // Meta Pixel event fire (handled server-side via Conversions API in future)
      results.push({ platform: "META", eventName, status: "QUEUED" });
    }

    if (integrations.tiktok?.enabled && integrations.tiktok?.pixelId) {
      results.push({ platform: "TIKTOK", eventName, status: "QUEUED" });
    }

    return results;
  }
}
