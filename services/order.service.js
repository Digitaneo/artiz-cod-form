import { ShopifyService } from "./shopify.service.js";
import { OrdersRepository } from "../repositories/orders.repository.js";
import { CustomerService } from "./customer.service.js";
import { AnalyticsService } from "./analytics.service.js";

export class OrderService {
  constructor(env) {
    this.env = env;
    this.shopifyService = new ShopifyService(env);
    this.ordersRepo = new OrdersRepository(env);
    this.customerService = new CustomerService(env);
    this.analyticsService = new AnalyticsService(env);
  }

  async createPublicCODOrder(shop, customer, items, shippingPrice = 0, note = "") {
    const nameParts = customer.name.trim().split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "-";

    const lineItems = items.map(item => ({
      variantId: String(item.variantId).includes("gid://")
        ? item.variantId
        : `gid://shopify/ProductVariant/${item.variantId}`,
      quantity: Number(item.quantity || 1)
    }));

    const draftOrderMutation = `
      mutation createCODOrder($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder { id name }
          userErrors { field message }
        }
      }
    `;

    const draftOrderVariables = {
      input: {
        lineItems,
        note: `COD Order via Artiz COD OS. Note: ${note || customer.note || "N/A"}`,
        tags: ["Artiz COD OS", "Cash on Delivery", "Pending Confirmation"],
        shippingAddress: {
          firstName,
          lastName,
          phone: customer.phone,
          address1: customer.address,
          city: customer.city || "Default City",
          country: customer.country || "Saudi Arabia"
        },
        shippingLine: {
          title: "Cash On Delivery Shipping",
          price: Number(shippingPrice)
        }
      }
    };

    const draftData = await this.shopifyService.adminRequest(shop, draftOrderMutation, draftOrderVariables);

    if (draftData.data?.draftOrderCreate?.userErrors?.length > 0) {
      const errs = draftData.data.draftOrderCreate.userErrors.map(e => e.message).join(", ");
      throw new Error(`Shopify Draft Order Error: ${errs}`);
    }

    const draftOrderId = draftData.data.draftOrderCreate.draftOrder.id;

    const completeMutation = `
      mutation completeCODOrder($id: ID!) {
        draftOrderComplete(id: $id, paymentPending: true) {
          draftOrder {
            order {
              id
              name
              totalPriceSet { shopMoney { amount currencyCode } }
            }
          }
          userErrors { field message }
        }
      }
    `;

    const completeData = await this.shopifyService.adminRequest(shop, completeMutation, { id: draftOrderId });

    if (completeData.data?.draftOrderComplete?.userErrors?.length > 0) {
      const errs = completeData.data.draftOrderComplete.userErrors.map(e => e.message).join(", ");
      throw new Error(`Shopify Complete Order Error: ${errs}`);
    }

    const createdOrder = completeData.data.draftOrderComplete.draftOrder.order;
    const numericOrderId = createdOrder.id.split("/").pop();
    const orderTotal = Number(createdOrder.totalPriceSet?.shopMoney?.amount || 0);

    const codOrderRecord = {
      orderId: createdOrder.id,
      orderNumber: createdOrder.name,
      customer: {
        name: `${firstName} ${lastName}`.trim(),
        phone: customer.phone,
        city: customer.city,
        address: customer.address
      },
      total: orderTotal,
      currency: createdOrder.totalPriceSet?.shopMoney?.currencyCode,
      codStage: "NEW",
      callStatus: "PENDING",
      createdAt: new Date().toISOString()
    };

    // Persist order in KV via Repository (single point of KV access)
    await this.ordersRepo.saveCODOrder(shop, numericOrderId, codOrderRecord);

    // Track customer history (async, non-blocking impact)
    await this.customerService.recordOrderForCustomer(shop, customer.phone, codOrderRecord);

    // Update daily analytics
    await this.analyticsService.recordNewOrder(shop, orderTotal);

    return {
      orderId: numericOrderId,
      orderNumber: createdOrder.name,
      total: `${orderTotal} ${createdOrder.totalPriceSet?.shopMoney?.currencyCode}`,
      thankYouUrl: `/pages/thank-you?order_id=${numericOrderId}&shop=${shop}`
    };
  }

  async getPublicOrderDetails(shop, orderId) {
    const fullOrderId = String(orderId).includes("gid://")
      ? orderId
      : `gid://shopify/Order/${orderId}`;

    const query = `
      query getOrderDetails($id: ID!) {
        order(id: $id) {
          id
          name
          createdAt
          totalPriceSet { shopMoney { amount currencyCode } }
          shippingAddress { name phone city address1 }
          lineItems(first: 20) {
            edges {
              node {
                title
                quantity
                originalUnitPriceSet { shopMoney { amount currencyCode } }
              }
            }
          }
        }
      }
    `;

    const data = await this.shopifyService.adminRequest(shop, query, { id: fullOrderId });

    if (!data.data?.order) {
      throw new Error("Order not found");
    }

    const order = data.data.order;
    const items = order.lineItems.edges.map(e => ({
      title: e.node.title,
      quantity: e.node.quantity,
      price: `${e.node.originalUnitPriceSet?.shopMoney?.amount} ${e.node.originalUnitPriceSet?.shopMoney?.currencyCode}`
    }));

    return {
      id: order.id,
      orderNumber: order.name,
      date: order.createdAt,
      total: `${order.totalPriceSet?.shopMoney?.amount} ${order.totalPriceSet?.shopMoney?.currencyCode}`,
      shippingAddress: order.shippingAddress,
      items
    };
  }
}
