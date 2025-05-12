import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_API_URL;

if (!graphqlUri) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_GRAPHQL_API_URL is not set.'
  );
}

export const client = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUri,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  cache: new InMemoryCache(),
});
