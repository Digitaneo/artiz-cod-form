import { KVRepository } from "./kv.repository.js";

export class ShippingRepository {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  getRatesKey(shop) {
    return `shipping_rates:${shop}`;
  }

  async getShippingConfig(shop) {
    if (!shop) throw new Error("Shop domain is required.");
    const data = await this.kvRepo.get(this.getRatesKey(shop));
    if (data) return data;

    // Return production default config for this store (with current store's default shipping rule)
    return {
      general: {
        enabled: true,
        defaultTitle: "توصيل سريع لجميع المدن",
        defaultRate: 30,
        freeShippingEnabled: true,
        freeShippingThreshold: 90800,
        freeShippingText: "مجاناً (توصيل سريع)",
        allowMultipleMethods: true,
        defaultMethods: [
          { id: "home", title: "توصيل للمنزل (سريع)", price: 30 },
          { id: "desk", title: "استلام من مكتب التوزيع (Stop Desk)", price: 20 }
        ]
      },
      rates: [],
      lastUpdated: new Date().toISOString()
    };
  }

  async saveShippingConfig(shop, config) {
    if (!shop) throw new Error("Shop domain is required.");
    const payload = {
      ...config,
      lastUpdated: new Date().toISOString()
    };
    await this.kvRepo.put(this.getRatesKey(shop), payload);
    return payload;
  }
}
