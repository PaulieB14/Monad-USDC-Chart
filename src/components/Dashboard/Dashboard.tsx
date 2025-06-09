import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled, { keyframes } from 'styled-components';
import { Grid, Text, Card, CardHeader, CardTitle, CardContent, Badge } from '../../styles';
import { LiveWhaleAlertStream } from '../LiveWhaleAlertStream';
import { WhaleLeaderboard } from '../WhaleLeaderboard';
import { GET_TOKEN_INFO } from '../../graphql/queries/whaleAlerts';
import { formatUSDCDisplay, BLOCKCHAIN_INFO } from '../../config';

// Animations
const countUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(131, 110, 249, 0.5); }
  50% { box-shadow: 0 0 20px rgba(131, 110, 249, 0.8), 0 0 30px rgba(131, 110, 249, 0.6); }
`;

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
  background: linear-gradient(45deg, #836ef9, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${glow} 3s ease-in-out infinite;
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
    animation: ${props => props.$connected ? pulse : 'none'} 2s infinite;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled(Card)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(131, 110, 249, 0.1), rgba(131, 110, 249, 0.05));
  border: 1px solid rgba(131, 110, 249, 0.2);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 3s infinite;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(131, 110, 249, 0.15), rgba(131, 110, 249, 0.1));
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(131, 110, 249, 0.3);
  }
`;

const StatContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 24px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #836ef9;
  margin-bottom: 8px;
  animation: ${countUp} 0.8s ease-out;
  background: linear-gradient(45deg, #836ef9, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #8b93a6;
  margin-bottom: 8px;
  font-weight: 500;
`;

const StatChart = styled.div`
  height: 40px;
  margin-top: 12px;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 2px;
`;

const ChartBar = styled.div<{ $height: number; $delay: number }>`
  width: 4px;
  background: linear-gradient(to top, #836ef9, #a855f7);
  border-radius: 2px;
  height: ${props => props.$height}%;
  animation: chartGrow 0.8s ease-out ${props => props.$delay}s both;
  
  @keyframes chartGrow {
    from { height: 0; }
    to { height: ${props => props.$height}%; }
  }
`;

const NetworkInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #8b93a6;
  margin-top: 8px;
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

// Animated number counter hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) return;
    
    let startTime: number;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(startCount + (end - startCount) * progress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

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

  const token = tokenData?.tokens?.[0];
  
  // Animated counters
  const animatedSupply = useAnimatedCounter(token ? parseFloat(formatUSDCDisplay(token.totalSupply).replace(/[$,BMK]/g, '')) : 0);
  const animatedHolders = useAnimatedCounter(token?.holderCount || 0);
  const animatedTransfers = useAnimatedCounter(token?.transferCount || 0);

  // Show loading state while initial data loads
  if (loading && !tokenData) {
    return (
      <DashboardContainer>
        <Header>
          <Title>USDC Whale Commander</Title>
          <Subtitle>Loading dashboard...</Subtitle>
          <StatusBadge $connected={false}>Connecting to {BLOCKCHAIN_INFO.NAME}...</StatusBadge>
        </Header>
        <LoadingCard>
          <LoadingSpinner />
        </LoadingCard>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>🐋 USDC Whale Commander</Title>
        <Subtitle>
          Real-time intelligence dashboard for tracking large USDC movements on {BLOCKCHAIN_INFO.NAME}
        </Subtitle>
        <StatusBadge $connected={isConnected}>
          {isConnected ? `🟢 Live Data Connected` : '🔴 Connection Issues'}
        </StatusBadge>
      </Header>

      {/* Enhanced Stats Overview */}
      <StatsGrid>
        <StatCard>
          <StatContent>
            <StatValue>
              ${animatedSupply.toLocaleString()}{token && formatUSDCDisplay(token.totalSupply).includes('B') ? 'B' : 'M'}
            </StatValue>
            <StatLabel>Total USDC Supply</StatLabel>
            <StatChart>
              {[85, 92, 78, 95, 88, 91, 96, 89, 93, 100].map((height, i) => (
                <ChartBar key={i} $height={height} $delay={i * 0.1} />
              ))}
            </StatChart>
            <NetworkInfo>
              📊 Market Cap Visualization
            </NetworkInfo>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatContent>
            <StatValue>{animatedHolders.toLocaleString()}</StatValue>
            <StatLabel>Total Holders</StatLabel>
            <StatChart>
              {[45, 67, 78, 89, 95, 88, 92, 85, 90, 87].map((height, i) => (
                <ChartBar key={i} $height={height} $delay={i * 0.1} />
              ))}
            </StatChart>
            <NetworkInfo>
              👥 Holder Growth Trend
            </NetworkInfo>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatContent>
            <StatValue>{animatedTransfers.toLocaleString()}</StatValue>
            <StatLabel>Total Transfers</StatLabel>
            <StatChart>
              {[65, 78, 85, 91, 88, 94, 89, 96, 92, 98].map((height, i) => (
                <ChartBar key={i} $height={height} $delay={i * 0.1} />
              ))}
            </StatChart>
            <NetworkInfo>
              📈 Transaction Activity
            </NetworkInfo>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatContent>
            <StatValue>🐋</StatValue>
            <StatLabel>Whale Status</StatLabel>
            <StatChart>
              {[100, 95, 88, 92, 96, 89, 93, 87, 91, 94].map((height, i) => (
                <ChartBar key={i} $height={height} $delay={i * 0.1} />
              ))}
            </StatChart>
            <NetworkInfo>
              🎯 Monitoring Active • {BLOCKCHAIN_INFO.NAME}
            </NetworkInfo>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* Main Components Grid */}
      <ComponentsGrid>
        <LiveWhaleAlertStream />
        <WhaleLeaderboard />
      </ComponentsGrid>

      {/* Enhanced Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '60px', 
        paddingTop: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#8b93a6'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '32px', marginRight: '12px' }}>🐋</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Powered by {BLOCKCHAIN_INFO.NAME} & The Graph Protocol
          </span>
        </div>
        <div style={{ fontSize: '14px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span>🔗 Explorer: <a href={BLOCKCHAIN_INFO.EXPLORER_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#836ef9' }}>
            {BLOCKCHAIN_INFO.EXPLORER_NAME}
          </a></span>
          <span>⚡ Updates: Every 15-60 seconds</span>
          <span>🎯 Built for DeFi transparency</span>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
