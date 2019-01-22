# apollo-graphql-schema-stitching
An example of stitching 2 GraphQL servers together so they can be served under a single endpoint with some merged data.

## Setup

To run, launch all 3 apollo servers:

In `graphql-store-server` run: `node index.js`
This will launch a server at `http://localhost:4001/`.
Navigate to `http://localhost:4001/` to use GraphiQL to use the store server.

In `graphql-order-server` run: `node index.js`
This will launch a server at `http://localhost:4002/`.
Navigate to `http://localhost:4002/` to use GraphiQL to use the orders server.

In the root directory run: `node index.js`
This will launch a server at `http://localhost:4000/`.
`http://localhost:4000/graphql` to use to use GraphiQL to use the merged server.
