import React from 'react';
import styled from 'styled-components';
import { Flex, Button, Text, Badge } from '../../styles';
import { toggleSound, isSoundEnabled } from '../../utils';

// Styled components for the header
const HeaderContainer = styled.header`
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
`;

const HeaderContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const MonadLogo = styled.img`
  height: 40px;
  filter: drop-shadow(0 0 8px rgba(131, 110, 249, 0.5));
`;

const AppTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const PoweredBy = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: -5px;
`;

const LogoText = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
  
  span {
    color: var(--color-primary);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--color-primary);
      animation: glow 2s infinite;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const StatusIndicator = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${({$active}) => $active ? 'rgba(46, 204, 64, 0.1)' : 'rgba(255, 65, 54, 0.1)'};
  border-radius: var(--border-radius-md);
  
  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({$active}) => $active ? 'var(--color-success)' : 'var(--color-danger)'};
    animation: ${({$active}) => $active ? 'pulse 2s infinite' : 'none'};
  }
`;

const StatsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--color-border);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const StatValue = styled.span`
  font-weight: 600;
  color: var(--color-primary);
`;

// Header component
const Header: React.FC = () => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());
  const [connected, setConnected] = React.useState(true);
  
  // Toggle sound effects
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };
  
  // Mock data for stats
  const stats = {
    whaleCount: 156,
    totalTransactions: 1243,
    largestTransfer: '$5.2M',
    lastUpdated: '2 min ago'
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Flex $justify="space-between">
          <Logo>
            <MonadLogo src="/images/monad-logo.svg" alt="Monad Logo" />
            <AppTitle>
              <PoweredBy>Powered by Monad</PoweredBy>
              <LogoText>USDC <span>Whale Commander</span></LogoText>
            </AppTitle>
          </Logo>
          
          <HeaderActions>
            <StatusIndicator $active={connected}>
              <Text $size="sm" $color={connected ? 'var(--color-success)' : 'var(--color-danger)'}>
                {connected ? 'Live Data' : 'Disconnected'}
              </Text>
            </StatusIndicator>
            
            <Button $variant="outline" onClick={handleToggleSound}>
              {soundOn ? '🔊 Sound On' : '🔇 Sound Off'}
            </Button>
            
            <Button $variant="primary">
              API Settings
            </Button>
          </HeaderActions>
        </Flex>
        
        <StatsBar>
          <StatItem>
            <Text $size="sm">Active Whales:</Text>
            <StatValue>{stats.whaleCount}</StatValue>
          </StatItem>
          
          <StatItem>
            <Text $size="sm">24h Transactions:</Text>
            <StatValue>{stats.totalTransactions}</StatValue>
          </StatItem>
          
          <StatItem>
            <Text $size="sm">Largest Transfer:</Text>
            <StatValue>{stats.largestTransfer}</StatValue>
            <Badge $variant="warning">Mega Whale</Badge>
          </StatItem>
          
          <StatItem>
            <Text $size="sm">Last Updated:</Text>
            <StatValue>{stats.lastUpdated}</StatValue>
          </StatItem>
        </StatsBar>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
