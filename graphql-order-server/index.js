const { ApolloServer, gql } = require('apollo-server'),
  { find } = require('lodash')

// Stub some item and product data
// This service stores more details data on each item placed
const orderItemData = [
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
  type OrderItem {
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
    orderItems: [OrderItem]
    products: [Product]
    product(id: Int): Product
    orderItemStatus(id: Int): String
  }
`;

// Define some resolvers where we stitch together the data
// This servics has a few entry points for fetching specific data
const resolvers = {
  Query: {
    orderItems: () => orderItemData,
    products: () => productData,
    product(obj, args, context, info) {
      return find(productData, { id: args.id });
    },
    orderItemStatus(obj, args, context, info) {
      return find(orderItemData, { id: args.id }).status;
    }
  },
  OrderItem: {
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
