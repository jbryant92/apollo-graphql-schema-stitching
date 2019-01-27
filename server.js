const express = require("express"),
  app = express(),
  { ApolloServer, gql } = require("apollo-server-express"),
  { introspectSchema,  makeRemoteExecutableSchema, mergeSchemas } = require("graphql-tools"),
  { createHttpLink } = require("apollo-link-http"),
  fetch = require("node-fetch");

// Build up a linked GraphQL Schema
const createSchema = async () => {
  // Build store service schema
  const createorderServiceSchema = async () => {
    const orderServiceLink = createHttpLink({
      uri: `http://localhost:4001/`,
      fetch
    });

    const schema = await introspectSchema(orderServiceLink);

    return makeRemoteExecutableSchema({
      schema,
      link: orderServiceLink
    });
  };

  // Build orders service schema
  const createsurveyServiceSchema = async () => {
    const surveyServiceLink = createHttpLink({
      uri: `http://localhost:4002/`,
      fetch
    });

    const schema = await introspectSchema(surveyServiceLink);

    return makeRemoteExecutableSchema({
      schema,
      link: surveyServiceLink
    });
  };

  // Wait for the introspect actions to complete so we have the completed schemas
  const orderServiceSchema = await createorderServiceSchema();
  const surveyServiceSchema = await createsurveyServiceSchema();

  // Add some additional fields based on data from both the sources
  const linkTypeDefs = `
    extend type StoreSurvey {
      product: Product
      status: String
    }

    extend type Order {
      comments: [Comment]
    }

    type Comment {
      user: String
      message: String
    }
  `

  // Merge the schemas with additional type definitions
  // Here we can also apply extra resolvers to fill out the Item type with extra fields
  return mergeSchemas({
    schemas: [
      orderServiceSchema,
      surveyServiceSchema,
      linkTypeDefs
    ],
    resolvers: {
      StoreSurvey: {
        product: {
          fragment: `... on StoreSurvey { productId }`,
          resolve(storeSurvey, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: surveyServiceSchema,
              operation: 'query',
              fieldName: 'product',
              args: {
                id: storeSurvey.productId
              },
              context,
              info
            })
          }
        },
        status: {
          fragment: `... on StoreSurvey { surveyId }`,
          resolve(storeSurvey, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: surveyServiceSchema,
              operation: 'query',
              fieldName: 'surveyStatus',
              args: {
                id: storeSurvey.surveyId
              },
              context,
              info
            })
          }
        }
      },
      Order: {
        comments: {
          resolve: async (order, args, context, info) => {
            const res = await fetch(`http://localhost:4003/orders/${order.id}/comments`);
            const comments = await res.json();
            return comments;
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
  console.log(`Main server ready at http://localhost:4000${server.graphqlPath}`);
});

app.listen(4000)

module.exports = app;
