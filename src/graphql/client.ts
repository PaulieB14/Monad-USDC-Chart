import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GRAPH_GATEWAY_URL } from '../config';

// Create an HTTP link to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: GRAPH_GATEWAY_URL,
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only', // Don't cache for real-time data
      nextFetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
