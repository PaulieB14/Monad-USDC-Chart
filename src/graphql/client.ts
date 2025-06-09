import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { SUBGRAPH_URL } from '../config';

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors but not on GraphQL errors
      return !!error && !error.result;
    }
  }
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.warn(
        `GraphQL Warning: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.warn(`Network Warning: ${networkError.message || networkError}`);
    
    // Don't throw errors in production, just log them
    if (process.env.NODE_ENV === 'development') {
      console.error('Full network error:', networkError);
    }
  }
});

// Create an HTTP link to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: SUBGRAPH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and other options
  fetchOptions: {
    timeout: 10000, // 10 second timeout
  }
});

// Create the Apollo Client instance with proper error handling
const client = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transfers: {
            keyArgs: ['where', 'orderBy', 'orderDirection'],
            merge(existing = [], incoming = []) {
              // Always return fresh data for real-time updates
              return incoming;
            }
          },
          accounts: {
            keyArgs: ['where', 'orderBy', 'orderDirection'],
            merge(existing = [], incoming = []) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first', // Use cache first to prevent too many requests
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'ignore', // Don't crash on GraphQL errors
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore', // Don't crash on GraphQL errors
    },
  },
  // Don't assume cache is fresh for too long
  assumeImmutableResults: false,
});

export default client;
