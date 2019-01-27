const { ApolloServer, gql } = require('apollo-server'),
  { find } = require('lodash')

// Stub some survey and product data
const surveyData = [
  {
    id: 1,
    productId: 123,
    status: 'placed'
  },
  {
    id: 2,
    productId: 124,
    status: 'error'
  },
  {
    id: 3,
    productId: 123,
    status: 'placed'
  },
  {
    id: 4,
    productId: 124,
    status: 'complete'
  },
  {
    id: 5,
    productId: 123,
    status: 'placed'
  }
];

// This service also owns data on all of the products
const productData = [
  {
    id: 123,
    name: 'Product Ex',
    description: 'Really cool product'
  },
  {
    id: 124,
    name: 'Vine Product',
    description: 'Amazing product'
  }
]

// Define the types
const typeDefs = gql`
  type Survey {
    id: Int
    status: String
    product: Product
  }

  type Product {
    id: Int
    name: String
    description: String
  }

  type Query {
    surveys: [Survey]
    products: [Product]
    product(id: Int): Product
    surveyStatus(id: Int): String
  }
`;

// Define some resolvers where we stitch together the data
// This servics has a few entry points for fetching specific data
const resolvers = {
  Query: {
    surveys: () => surveyData,
    products: () => productData,
    product(obj, args, context, info) {
      return find(productData, { id: args.id });
    },
    surveyStatus(obj, args, context, info) {
      return find(surveyData, { id: args.id }).status;
    }
  },
  Survey: {
    product(obj, args, context, info) {
      return find(productData, { id: obj.productId });
    }
  }
};

// Setup the server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`Order server ready at ${url}`);
});
