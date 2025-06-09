import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { SUBGRAPH_URL } from '../config';

// Error handling link (non-blocking)
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.warn(`GraphQL Warning: ${message} at ${path}`);
    });
  }

  if (networkError) {
    console.warn(`Network Warning: ${networkError.message || networkError}`);
  }
  
  // Don't block execution, just log warnings
});

// Create an HTTP link to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: SUBGRAPH_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transfers: {
            merge(existing = [], incoming = []) {
              return incoming; // Always use fresh data
            }
          },
          accounts: {
            merge(existing = [], incoming = []) {
              return incoming; // Always use fresh data
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore', // Don't crash on errors
    },
    query: {
      fetchPolicy: 'cache-first', 
      errorPolicy: 'ignore', // Don't crash on errors
    },
  },
});

export default client;
