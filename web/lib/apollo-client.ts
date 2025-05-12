import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
      'http://localhost:3900/graphql',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  cache: new InMemoryCache(),
});
