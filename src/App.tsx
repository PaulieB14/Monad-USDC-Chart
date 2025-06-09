import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { GlobalStyles } from './styles';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0b0d',
          color: '#fff',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ color: '#ff4136', marginBottom: '20px' }}>🐋 Dashboard Error</h1>
          <p style={{ marginBottom: '20px', textAlign: 'center', maxWidth: '600px' }}>
            Something went wrong loading the USDC Whale Commander dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#836ef9',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Dashboard
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', maxWidth: '800px' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                background: '#1a1a1a', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {this.state.error?.stack || 'No error details available'}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <GlobalStyles />
        <Layout>
          <Dashboard />
        </Layout>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;
