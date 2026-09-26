import { KVRepository } from "./kv.repository.js";

export class SettingsRepository {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  async getStoreConfig(shop) {
    if (!shop) throw new Error("Shop domain is required for SettingsRepository.");
    return await this.kvRepo.get(shop);
  }

  async saveStoreConfig(shop, config) {
    if (!shop) throw new Error("Shop domain is required for SettingsRepository.");
    await this.kvRepo.put(shop, config);
    return config;
  }
}
