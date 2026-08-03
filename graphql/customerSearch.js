export const customerSearchQuery = `
  query CustomerSearch($query: String!) {
    customers(query: $query, first: 5) {
      edges {
        node {
          id
          firstName
          lastName
          email
          phone
        }
      }
    }
  }
`;
