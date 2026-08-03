export const orderGetQuery = `
  query OrderGet($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
