// lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:3900/graphql', // NestJSのGraphQLエンドポイント
  cache: new InMemoryCache(),
});