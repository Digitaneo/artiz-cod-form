import { getCurrentShop } from "../utils/session.js";
import { adminRequest } from "../shopify.js";


export async function dashboardStats(request, env) {


  const shop =
    await getCurrentShop(request);


  const query = `
  {
    productsCount {
      count
    }

    customersCount {
      count
    }

    orders(first:100, reverse:true) {

      edges {

        node {

          id

          name

          displayFinancialStatus

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

        }

      }

    }

  }
  `;

  const data = await adminRequest(
    shop,
    query,
    {},
    env
  );

  const orders =
    data.data.orders.edges.map(edge => edge.node);

  let revenue = 0;

  for (const order of orders) {

    revenue += Number(
      order.currentTotalPriceSet.shopMoney.amount
    );

  }

  const recentOrders =
    orders.slice(0,5).map(order => ({

      id: order.id,

      orderNumber: order.name,

      customer:
        order.customer
          ? `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim()
          : "-",

      total:
        `${order.currentTotalPriceSet.shopMoney.amount}
        ${order.currentTotalPriceSet.shopMoney.currencyCode}`,

      status:
        order.displayFinancialStatus

    }));


  return Response.json({

    ok:true,

    shop,

    stats:{

      orders:orders.length,

      revenue,

      customers:data.data.customersCount.count,

      products:data.data.productsCount.count

    },

    recentOrders

  });

}