const express = require("express"),
  app = express(),
  { ApolloServer, gql } = require("apollo-server-express"),
  { introspectSchema,  makeRemoteExecutableSchema, mergeSchemas } = require("graphql-tools"),
  { createHttpLink } = require("apollo-link-http"),
  fetch = require("node-fetch");

// Build up a linked GraphQL Schema
const createSchema = async () => {
  // Build store service schema
  const createStoreServiceSchema = async () => {
    const storeServiceLink = createHttpLink({
      uri: `http://localhost:4001/`,
      fetch
    });

    const schema = await introspectSchema(storeServiceLink);

    return makeRemoteExecutableSchema({
      schema,
      link: storeServiceLink
    });
  };

  // Build orders service schema
  const createOrdersServiceSchema = async () => {
    const ordersServiceLink = createHttpLink({
      uri: `http://localhost:4002/`,
      fetch
    });

    const schema = await introspectSchema(ordersServiceLink);

    return makeRemoteExecutableSchema({
      schema,
      link: ordersServiceLink
    });
  };

  // Wait for the introspect actions to complete so we have the completed schemas
  const storeServiceSchema = await createStoreServiceSchema();
  const ordersServiceSchema = await createOrdersServiceSchema();

  // Add some additional fields based on data from both the sources
  const linkTypeDefs = `
    extend type Item {
      product: Product
      status: String
    }
  `

  // Merge the schemas with additional type definitions
  // Here we can also apply extra resolvers to fill out the Item type with extra fields
  return mergeSchemas({
    schemas: [
      storeServiceSchema,
      ordersServiceSchema,
      linkTypeDefs
    ],
    resolvers: {
      Item: {
        product: {
          fragment: `... on OrderItem { productId }`,
          resolve(orderItem, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: ordersServiceSchema,
              operation: 'query',
              fieldName: 'product',
              args: {
                id: orderItem.productId
              },
              context,
              info
            })
          }
        },
        status: {
          fragment: `... on OrderItem { id }`,
          resolve(orderItem, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: ordersServiceSchema,
              operation: 'query',
              fieldName: 'orderItemStatus',
              args: {
                id: orderItem.id
              },
              context,
              info
            })
          }
        }
      }
    }
  });
};

// When the schema is built, kick off the Appollo server
createSchema().then(schema => {
  const server = new ApolloServer({
    schema,
    playground: {
      endpoint: '/graphql',
      settings: {
        'editor.theme': 'light'
      }
    }
  });

  server.applyMiddleware({ app });
  console.log(`Main server ready at http://localhost:4001${server.graphqlPath}`);
});

app.listen(4000)

module.exports = app;
