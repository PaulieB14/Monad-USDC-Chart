import React from 'react';
import styled from 'styled-components';
import Header from './Header';

// Styled components for the layout
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding: var(--spacing-lg);
  padding-top: 80px; /* Space for header */
  flex: 1;
  background-color: var(--color-background);
`;

// Layout component
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
