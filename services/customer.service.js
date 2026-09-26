import { CustomersRepository } from "../repositories/customers.repository.js";

export class CustomerService {
  constructor(env) {
    this.customersRepo = new CustomersRepository(env);
  }

  async getOrCreateCustomerHistory(shop, phone) {
    let history = await this.customersRepo.getCustomerHistory(shop, phone);
    if (!history) {
      history = {
        phone,
        shop,
        totalOrders: 0,
        confirmedOrders: 0,
        cancelledOrders: 0,
        totalSpend: 0,
        riskLevel: "LOW",
        firstOrderAt: null,
        lastOrderAt: null
      };
    }
    return history;
  }

  async recordOrderForCustomer(shop, phone, orderData) {
    const history = await this.getOrCreateCustomerHistory(shop, phone);

    history.totalOrders += 1;
    history.lastOrderAt = new Date().toISOString();
    if (!history.firstOrderAt) history.firstOrderAt = history.lastOrderAt;

    await this.customersRepo.saveCustomerHistory(shop, phone, history);
    return history;
  }
}
