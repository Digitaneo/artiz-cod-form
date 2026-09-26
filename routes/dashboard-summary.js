import { getCurrentShop } from "../utils/session.js";
import { adminRequest } from "../shopify.js";

export async function dashboardSummary(request, env) {
  try {
    const shop = await getCurrentShop(request, env);

    const query = `
    {
      productsCount {
        count
      }
      customersCount {
        count
      }
      orders(first: 50, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            currentTotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              firstName
              lastName
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
    `;

    const data = await adminRequest(shop, query, {}, env);

    const ordersNodes = data.data.orders?.edges?.map(edge => edge.node) || [];

    let totalRevenue = 0;
    let todayOrdersCount = 0;
    let todayRevenue = 0;

    const todayStr = new Date().toISOString().split("T")[0];
    const productSalesMap = {};

    for (const order of ordersNodes) {
      const amount = Number(order.currentTotalPriceSet?.shopMoney?.amount || 0);
      totalRevenue += amount;

      if (order.createdAt && order.createdAt.startsWith(todayStr)) {
        todayOrdersCount++;
        todayRevenue += amount;
      }

      const lineItems = order.lineItems?.edges?.map(e => e.node) || [];
      for (const item of lineItems) {
        productSalesMap[item.title] = (productSalesMap[item.title] || 0) + (item.quantity || 1);
      }
    }

    const recentOrders = ordersNodes.slice(0, 5).map(order => ({
      id: order.id,
      orderNumber: order.name,
      customer: order.customer
        ? `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim()
        : "Guest Customer",
      total: `${order.currentTotalPriceSet?.shopMoney?.amount || 0} ${order.currentTotalPriceSet?.shopMoney?.currencyCode || ""}`,
      financialStatus: order.displayFinancialStatus,
      fulfillmentStatus: order.displayFulfillmentStatus,
      date: order.createdAt
    }));

    const topProducts = Object.entries(productSalesMap)
      .map(([title, sales]) => ({ title, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return Response.json({
      ok: true,
      shop,
      summary: {
        stats: {
          orders: ordersNodes.length,
          revenue: totalRevenue.toFixed(2),
          customers: data.data.customersCount?.count || 0,
          products: data.data.productsCount?.count || 0
        },
        today: {
          orders: todayOrdersCount,
          revenue: todayRevenue.toFixed(2)
        },
        recentOrders,
        topProducts,
        system: {
          kv: "OK",
          shopify: "Connected",
          status: "Active"
        }
      }
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message || "Failed to load dashboard summary" },
      { status: 500 }
    );
  }
}
