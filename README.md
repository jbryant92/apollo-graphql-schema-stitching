# Apollo GraphQL Schema Stitching

An example of stitching 2 GraphQL schemas together and mixing in a REST endpoint so they can be served under a single endpoint with some merged cross schema data.

## Setup

To run, you need to run 4 servers:

```
# Launch the orders server
> graphql-order-server/server.js

# Launch the surveys server
> graphql-survey-server/server.js

# Launch the comments server
> rest-comments-server/server.js

# Launch the stitching server
> server.js
```

Each server will point you to where it can be directly accessed. For more information visit [the Apollo GraphQL website](https://www.apollographql.com/).
