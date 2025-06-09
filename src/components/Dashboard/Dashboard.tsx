import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Grid, Text, Card, CardHeader, CardTitle, CardContent, Badge } from '../../styles';
import { LiveWhaleAlertStream } from '../LiveWhaleAlertStream';
import { WhaleLeaderboard } from '../WhaleLeaderboard';
import { GET_TOKEN_INFO } from '../../graphql/queries/whaleAlerts';
import { formatUSDCDisplay } from '../../config';

// Styled components
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0b0d 0%, #1a1b1e 100%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #836ef9, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #8b93a6;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatusBadge = styled.div<{ $connected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  background: ${props => props.$connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${props => props.$connected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.$connected ? '#22c55e' : '#ef4444'};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$connected ? '#22c55e' : '#ef4444'};
    animation: ${props => props.$connected ? 'pulse 2s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled(Card)`
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #836ef9;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #8b93a6;
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(131, 110, 249, 0.3);
  border-top: 4px solid #836ef9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Query for basic token info to check connection
  const { data: tokenData, loading, error } = useQuery(GET_TOKEN_INFO, {
    errorPolicy: 'ignore',
    pollInterval: 30000,
    onCompleted: () => setIsConnected(true),
    onError: () => setIsConnected(false),
  });

  // Set connection status based on query results
  useEffect(() => {
    setIsConnected(!loading && !error && !!tokenData);
  }, [loading, error, tokenData]);

  // Show loading state while initial data loads
  if (loading && !tokenData) {
    return (
      <DashboardContainer>
        <Header>
          <Title>USDC Whale Commander</Title>
          <Subtitle>Loading dashboard...</Subtitle>
          <StatusBadge $connected={false}>Connecting to blockchain data...</StatusBadge>
        </Header>
        <LoadingCard>
          <LoadingSpinner />
        </LoadingCard>
      </DashboardContainer>
    );
  }

  const token = tokenData?.tokens?.[0];

  return (
    <DashboardContainer>
      <Header>
        <Title>USDC Whale Commander</Title>
        <Subtitle>
          Real-time intelligence dashboard for tracking large USDC movements
        </Subtitle>
        <StatusBadge $connected={isConnected}>
          {isConnected ? 'Live Data Connected' : 'Connection Issues'}
        </StatusBadge>
      </Header>

      {/* Stats Overview */}
      {token && (
        <StatsGrid>
          <StatCard>
            <CardContent style={{ padding: '20px' }}>
              <StatValue>{formatUSDCDisplay(token.totalSupply)}</StatValue>
              <StatLabel>Total USDC Supply</StatLabel>
            </CardContent>
          </StatCard>
          
          <StatCard>
            <CardContent style={{ padding: '20px' }}>
              <StatValue>{token.holderCount?.toLocaleString() || 'N/A'}</StatValue>
              <StatLabel>Total Holders</StatLabel>
            </CardContent>
          </StatCard>
          
          <StatCard>
            <CardContent style={{ padding: '20px' }}>
              <StatValue>{token.transferCount?.toLocaleString() || 'N/A'}</StatValue>
              <StatLabel>Total Transfers</StatLabel>
            </CardContent>
          </StatCard>
          
          <StatCard>
            <CardContent style={{ padding: '20px' }}>
              <StatValue>🐋</StatValue>
              <StatLabel>Whale Status: Active</StatLabel>
            </CardContent>
          </StatCard>
        </StatsGrid>
      )}

      {/* Main Components Grid */}
      <ComponentsGrid>
        <LiveWhaleAlertStream />
        <WhaleLeaderboard />
      </ComponentsGrid>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '60px', 
        paddingTop: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#8b93a6'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🐋</span>
          Powered by The Graph Protocol & Ethereum
        </div>
        <div style={{ fontSize: '14px' }}>
          Built for the DeFi community • Data updates every 15-60 seconds
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
