import { adminRequest } from "../shopify.js";
import { getCurrentShop } from "../utils/session.js";

export async function ordersListRoute(request, env) {
  const shop = await getCurrentShop(request, env);
  const url = new URL(request.url);
  const first = Number(url.searchParams.get("first") || 20);
  const search = url.searchParams.get("search") || "";


  let queryString = "";

  if (search.trim() !== "") {
    queryString = `query: "${search}"`;
  }

  const query = `
  {
    orders(
      first:${first}
      reverse:true
      ${queryString}
    ) {

      edges {

        cursor

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

            email

          }

        }

      }

      pageInfo {

        hasNextPage

        hasPreviousPage

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

  const orders = data.data.orders.edges.map(({ node, cursor }) => ({

    id: node.id,

    cursor,

    orderNumber: node.name,

    createdAt: node.createdAt,

    customer: node.customer
      ? `${node.customer.firstName ?? ""} ${node.customer.lastName ?? ""}`.trim()
      : "-",

    email: node.customer?.email ?? "",

    total:
      `${node.currentTotalPriceSet.shopMoney.amount} ${node.currentTotalPriceSet.shopMoney.currencyCode}`,

    financialStatus:
      node.displayFinancialStatus,

    fulfillmentStatus:
      node.displayFulfillmentStatus

  }));

  return Response.json({

    ok: true,

    orders,

    pageInfo: data.data.orders.pageInfo

  });

}