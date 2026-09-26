import { KVRepository } from "./kv.repository.js";

export class CustomersRepository {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  async getCustomerHistory(shop, phone) {
    const key = `customer:${shop}:${phone}`;
    return await this.kvRepo.get(key);
  }

  async saveCustomerHistory(shop, phone, history) {
    const key = `customer:${shop}:${phone}`;
    await this.kvRepo.put(key, history);
  }
}
