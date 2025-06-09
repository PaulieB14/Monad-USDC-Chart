import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { GlobalStyles } from './styles';
import { initSoundEffects } from './utils';

// Initialize sound effects
initSoundEffects();

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <GlobalStyles />
      <Layout>
        <Dashboard />
      </Layout>
    </ApolloProvider>
  );
};

export default App;
