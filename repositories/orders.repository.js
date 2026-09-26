import { KVRepository } from "./kv.repository.js";

export class OrdersRepository {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  async saveCODOrder(shop, orderId, orderRecord) {
    const key = `cod_order:${shop}:${orderId}`;
    await this.kvRepo.put(key, orderRecord);
    return orderRecord;
  }

  async getCODOrder(shop, orderId) {
    const key = `cod_order:${shop}:${orderId}`;
    return await this.kvRepo.get(key);
  }

  async listCODOrders(shop) {
    const prefix = `cod_order:${shop}:`;
    const list = await this.kvRepo.list({ prefix });
    const orders = [];
    for (const key of list.keys) {
      const order = await this.kvRepo.get(key.name);
      if (order) orders.push(order);
    }
    return orders;
  }
}
