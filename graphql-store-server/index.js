const { ApolloServer, gql } = require('apollo-server');

// Stub some order data.
// Each order has some details, and some items which were placed in the order
// This service only stores the item id and a product id.
const orderData = [
  {
    id: 1,
    title: 'New order #1234',
    customer: 'Frances Roberts',
    items: [
      {
        id: 1,
        productId: 123
      },
      {
        id: 2,
        productId: 124
      },
      {
        id: 3,
        productId: 123
      },
    ]
  },
  {
    id: 2,
    title: 'New order #1235',
    customer: 'Matilda Barlow',
    items: [
      {
        id: 4,
        productId: 124
      },
      {
        id: 5,
        productId: 123
      },
    ]
  },
];

// Define the types
const typeDefs = gql`
  type Order {
    id: Int
    title: String
    customer: String
    items: [Item]
  }

  type Item {
    id: Int
    productId: Int
  }

  type Query {
    orders: [Order]
  }
`;

const resolvers = {
  Query: {
    orders: () => orderData,
  },
};

// Setup the server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Store server ready at ${url}`);
});
