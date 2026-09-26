import { KVRepository } from "../repositories/kv.repository.js";

export class FraudService {
  constructor(env) {
    this.kvRepo = new KVRepository(env);
  }

  async analyzeOrderRisk(shop, customerData) {
    const blacklist = await this.kvRepo.get(`blacklist:${shop}`) || { phones: [], ips: [] };

    if (blacklist.phones.includes(customerData.phone)) {
      return { action: "REJECT", riskScore: 100, reason: "Blacklisted phone number" };
    }

    return { action: "ACCEPT", riskScore: 10, reason: "Passed risk analysis" };
  }
}
