import { KVRepository } from "../repositories/kv.repository.js";

export class BillingService {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  async getSubscription(shop) {
    const key = `billing:${shop}`;
    return await this.kvRepo.get(key) || {
      shop,
      plan: "FREE",
      status: "TRIAL",
      trialEndsAt: null,
      subscriptionId: null
    };
  }

  async saveSubscription(shop, subscriptionData) {
    const key = `billing:${shop}`;
    await this.kvRepo.put(key, subscriptionData);
    return subscriptionData;
  }

  async isWithinPlanLimits(shop) {
    const subscription = await this.getSubscription(shop);
    // Placeholder: all stores pass during trial/free
    return { allowed: true, plan: subscription.plan };
  }
}
