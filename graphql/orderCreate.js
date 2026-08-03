export const orderCreateQuery = `
  mutation OrderCreate($input: OrderInput!) {
    orderCreate(input: $input) {
      userErrors {
        field
        message
      }
      order {
        id
      }
    }
  }
`;
