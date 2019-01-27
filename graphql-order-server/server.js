const { ApolloServer, gql } = require('apollo-server');
const  fetch = require("node-fetch");

// Stub some order data.
// Each order has some details, and some surveys which were placed in the order
// This service only stores the survey id and a product id.
const orderData = [
  {
    id: 1,
    title: 'New order #1234',
    customer: 'Frances Roberts',
    surveys: [
      {
        surveyId: 1,
        productId: 123
      },
      {
        surveyId: 2,
        productId: 124
      },
      {
        surveyId: 3,
        productId: 123
      },
    ]
  },
  {
    id: 2,
    title: 'New order #1235',
    customer: 'Matilda Barlow',
    surveys: [
      {
        surveyId: 4,
        productId: 124
      },
      {
        surveyId: 5,
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
    surveys: [StoreSurvey]
  }

  type StoreSurvey {
    surveyId: Int
    productId: Int
  }

  type Query {
    orders: [Order]
  }
`;

// Add resolvers
const resolvers = {
  Query: {
    orders: () => orderData,
  }
};

// Setup the server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Store server ready at ${url}`);
});
