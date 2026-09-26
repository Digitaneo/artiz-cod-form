import { KVRepository } from "../repositories/kv.repository.js";

export class AnalyticsService {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  _getTodayKey(shop) {
    const today = new Date().toISOString().split("T")[0];
    return `analytics:${shop}:${today}`;
  }

  async getOrInitDaily(shop) {
    const key = this._getTodayKey(shop);
    const existing = await this.kvRepo.get(key);
    if (existing) return existing;

    return {
      date: new Date().toISOString().split("T")[0],
      shop,
      totalOrders: 0,
      confirmedOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      confirmationRate: 0,
      averageOrderValue: 0
    };
  }

  async recordNewOrder(shop, orderTotal = 0) {
    const key = this._getTodayKey(shop);
    const analytics = await this.getOrInitDaily(shop);

    analytics.totalOrders += 1;
    analytics.totalRevenue += Number(orderTotal);
    if (analytics.totalOrders > 0) {
      analytics.averageOrderValue = analytics.totalRevenue / analytics.totalOrders;
    }

    await this.kvRepo.put(key, analytics);
    return analytics;
  }

  async recordConfirmedOrder(shop) {
    const key = this._getTodayKey(shop);
    const analytics = await this.getOrInitDaily(shop);

    analytics.confirmedOrders += 1;
    if (analytics.totalOrders > 0) {
      analytics.confirmationRate = Math.round((analytics.confirmedOrders / analytics.totalOrders) * 100);
    }

    await this.kvRepo.put(key, analytics);
    return analytics;
  }
}
