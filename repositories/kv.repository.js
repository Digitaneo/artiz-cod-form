export class KVRepository {
  constructor(env) {
    if (!env || !env.SHOPIFY_CONFIG) {
      throw new Error("Cloudflare KV binding (SHOPIFY_CONFIG) is missing.");
    }
    this.kv = env.SHOPIFY_CONFIG;
  }

  async get(key) {
    const data = await this.kv.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  async put(key, value, options = {}) {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    await this.kv.put(key, stringValue, options);
  }

  async delete(key) {
    await this.kv.delete(key);
  }

  async list(options = {}) {
    return await this.kv.list(options);
  }
}
