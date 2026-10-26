// Cash on Delivery (COD) Adapter

export class CodGateway {
  constructor(env, config = {}) {
    this.env = env;
    this.config = config;
  }

  async processCheckout({ orderService, shop, customer, items, shippingPrice, note, options }) {
    return await orderService.createPublicCODOrder(
      shop,
      customer,
      items,
      shippingPrice,
      note,
      options
    );
  }
}
