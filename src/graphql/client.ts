import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { SUBGRAPH_URL } from '../config';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL Error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`Network Error: ${networkError}`);
  }
});

// Create an HTTP link to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: SUBGRAPH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create the Apollo Client instance with proper error handling
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transfers: {
            keyArgs: ['where', 'orderBy', 'orderDirection'],
            merge(existing = [], incoming) {
              return incoming; // Replace with fresh data for real-time updates
            }
          },
          accounts: {
            keyArgs: ['where', 'orderBy', 'orderDirection'],
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
