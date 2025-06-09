import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid, Flex, Text, Card, CardHeader, CardTitle, CardContent, Badge } from '../../styles';
import { LiveWhaleAlertStream } from '../LiveWhaleAlertStream';
import { WhaleLeaderboard } from '../WhaleLeaderboard';

// Enhanced chart styled components
const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  position: relative;
  
  svg {
    width: 200px;
    height: 200px;
  }
`;

const PieChartCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
`;

const ChartLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
  width: 100%;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
  box-shadow: 0 0 5px ${({ $color }) => $color};
`;

const BarChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  position: relative;
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 250px;
  padding: var(--spacing-sm);
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  width: 60px;
`;

const Bar = styled.div<{ $height: number; $color: string }>`
  width: 100%;
  height: ${({ $height }) => $height}%;
  background: linear-gradient(to top, ${({ $color }) => $color}, ${({ $color }) => $color}99);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease, width 0.3s ease;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    filter: brightness(1.2);
    width: 110%;
  }
  
  &::after {
    content: '${({ $height }) => $height}%';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const BarLabel = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
  font-weight: 500;
`;

const LineChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  position: relative;
  
  svg {
    width: 100%;
    height: 250px;
  }
`;

const ChartOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const TimeSelector = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  position: absolute;
  top: 10px;
  right: 10px;
`;

const TimeButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.3)'};
  border: none;
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

// Styled components
const DashboardContainer = styled.div`
  padding: var(--spacing-md);
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 1200px;
  overflow-y: auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: var(--spacing-lg);
  text-align: center;
  animation: fadeIn 0.5s ease-out;
`;

const DashboardTitle = styled.h1`
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
  text-shadow: 0 0 10px rgba(131, 110, 249, 0.5);
`;

const DashboardSubtitle = styled.p`
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border);
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const MonadIcon = styled.img`
  height: 30px;
  filter: drop-shadow(0 0 5px rgba(131, 110, 249, 0.5));
`;

const FooterText = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const ChartCard = styled(Card)`
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  height: 350px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 10px rgba(131, 110, 249, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  }
`;

const ChartsSection = styled.div`
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
`;

const MainContent = styled.div`
  flex: 1;
`;

// Dashboard component
const Dashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('24h');
  const [activityData, setActivityData] = useState({
    buys: { count: 512, percent: 12 },
    sells: { count: 398, percent: -5 },
    transfers: { count: 245, percent: 8 },
    other: { count: 88, percent: 0 }
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchActivityData = async () => {
      try {
        // Simulated data for different time periods
        if (timePeriod === '24h') {
          setActivityData({
            buys: { count: 512, percent: 12 },
            sells: { count: 398, percent: -5 },
            transfers: { count: 245, percent: 8 },
            other: { count: 88, percent: 0 }
          });
        } else if (timePeriod === '7d') {
          setActivityData({
            buys: { count: 3240, percent: 8 },
            sells: { count: 2890, percent: -2 },
            transfers: { count: 1560, percent: 15 },
            other: { count: 420, percent: 3 }
          });
        } else if (timePeriod === '30d') {
          setActivityData({
            buys: { count: 12450, percent: 5 },
            sells: { count: 10980, percent: 7 },
            transfers: { count: 6240, percent: 10 },
            other: { count: 1830, percent: -2 }
          });
        }
      } catch (error) {
        console.error('Error fetching whale activity data:', error);
      }
    };
    
    fetchActivityData();
  }, [timePeriod]);

  const handleTimeChange = (period: string) => {
    setTimePeriod(period);
  };

  return (
    <DashboardContainer>
      <MainContent>
        <DashboardHeader>
          <DashboardTitle>USDC Whale Commander</DashboardTitle>
          <DashboardSubtitle>
            Real-time intelligence dashboard for tracking large USDC movements with military-grade precision
          </DashboardSubtitle>
        </DashboardHeader>
        
        <Grid $columns="1fr 1fr" $gap="var(--spacing-lg)" style={{ marginBottom: 'var(--spacing-md)' }}>
          <LiveWhaleAlertStream />
          <WhaleLeaderboard />
        </Grid>
        
        <ChartsSection>
          <DashboardTitle style={{ 
            fontSize: 'var(--font-size-xl)', 
            marginBottom: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            background: 'linear-gradient(90deg, rgba(131, 110, 249, 0.1), transparent)',
            borderLeft: '4px solid var(--color-primary)',
            borderRadius: 'var(--border-radius-sm)'
          }}>
            USDC Analytics
          </DashboardTitle>
          
          <Grid $columns="1fr 1fr 1fr" $gap="var(--spacing-lg)">
        <ChartCard>
          <CardHeader>
            <CardTitle>USDC Distribution</CardTitle>
            <Badge $variant="info">Live Data</Badge>
          </CardHeader>
          <CardContent>
            <PieChartContainer>
              <svg viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2ECC40" />
                    <stop offset="100%" stopColor="#01FF70" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF851B" />
                    <stop offset="100%" stopColor="#FF4136" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#gradient1)" strokeWidth="20" strokeDasharray="75 25" filter="url(#glow)" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#gradient2)" strokeWidth="20" strokeDasharray="25 75" strokeDashoffset="-75" filter="url(#glow)" />
              </svg>
              <PieChartCenter>
                <Text $size="xl" $weight="bold">75%</Text>
                <Text $size="xs">Whale Concentration</Text>
              </PieChartCenter>
              <ChartLegend>
                <LegendItem>
                  <LegendColor $color="#2ECC40" />
                  <Text $size="sm">Top 10 Whales (75%)</Text>
                </LegendItem>
                <LegendItem>
                  <LegendColor $color="#FF851B" />
                  <Text $size="sm">Other Holders (25%)</Text>
                </LegendItem>
              </ChartLegend>
            </PieChartContainer>
          </CardContent>
        </ChartCard>
        
        <ChartCard>
          <CardHeader>
            <CardTitle>Whale Activity ({timePeriod})</CardTitle>
            <Badge $variant="warning">High Activity</Badge>
          </CardHeader>
          <CardContent>
            <BarChartContainer>
              <TimeSelector>
                <TimeButton $active={timePeriod === '24h'} onClick={() => handleTimeChange('24h')}>24h</TimeButton>
                <TimeButton $active={timePeriod === '7d'} onClick={() => handleTimeChange('7d')}>7d</TimeButton>
                <TimeButton $active={timePeriod === '30d'} onClick={() => handleTimeChange('30d')}>30d</TimeButton>
              </TimeSelector>
              <BarChart>
                {(() => {
                  // Calculate the maximum count to determine relative heights
                  const maxCount = Math.max(
                    activityData.buys.count,
                    activityData.sells.count,
                    activityData.transfers.count,
                    activityData.other.count
                  );
                  
                  // Calculate heights as percentages of the maximum
                  const buyHeight = Math.round((activityData.buys.count / maxCount) * 100);
                  const sellHeight = Math.round((activityData.sells.count / maxCount) * 100);
                  const transferHeight = Math.round((activityData.transfers.count / maxCount) * 100);
                  const otherHeight = Math.round((activityData.other.count / maxCount) * 100);
                  
                  return (
                    <>
                      <BarGroup>
                        <Bar $height={buyHeight} $color="#FF4136" />
                        <BarLabel>Buys ({activityData.buys.count.toLocaleString()})</BarLabel>
                        <Text $size="xs" style={{ color: activityData.buys.percent > 0 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '4px' }}>
                          {activityData.buys.percent > 0 ? '+' : ''}{activityData.buys.percent}%
                        </Text>
                      </BarGroup>
                      <BarGroup>
                        <Bar $height={sellHeight} $color="#0074D9" />
                        <BarLabel>Sells ({activityData.sells.count.toLocaleString()})</BarLabel>
                        <Text $size="xs" style={{ color: activityData.sells.percent > 0 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '4px' }}>
                          {activityData.sells.percent > 0 ? '+' : ''}{activityData.sells.percent}%
                        </Text>
                      </BarGroup>
                      <BarGroup>
                        <Bar $height={transferHeight} $color="#2ECC40" />
                        <BarLabel>Transfers ({activityData.transfers.count.toLocaleString()})</BarLabel>
                        <Text $size="xs" style={{ color: activityData.transfers.percent > 0 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '4px' }}>
                          {activityData.transfers.percent > 0 ? '+' : ''}{activityData.transfers.percent}%
                        </Text>
                      </BarGroup>
                      <BarGroup>
                        <Bar $height={otherHeight} $color="#FFDC00" />
                        <BarLabel>Other ({activityData.other.count.toLocaleString()})</BarLabel>
                        <Text $size="xs" style={{ color: activityData.other.percent !== 0 ? (activityData.other.percent > 0 ? 'var(--color-success)' : 'var(--color-danger)') : 'var(--color-text-secondary)', marginTop: '4px' }}>
                          {activityData.other.percent > 0 ? '+' : activityData.other.percent < 0 ? '' : '±'}{activityData.other.percent}%
                        </Text>
                      </BarGroup>
                    </>
                  );
                })()}
              </BarChart>
              <ChartOverlay>
                Total: {(activityData.buys.count + activityData.sells.count + activityData.transfers.count + activityData.other.count).toLocaleString()} transactions
              </ChartOverlay>
            </BarChartContainer>
          </CardContent>
        </ChartCard>
        
        <ChartCard>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <Badge $variant="success">Trending Up</Badge>
          </CardHeader>
          <CardContent>
            <LineChartContainer>
              <svg viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0074D9" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0074D9" stopOpacity="0" />
                  </linearGradient>
                  <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <polyline 
                  points="0,40 10,35 20,38 30,25 40,30 50,15 60,20 70,10 80,5 90,15 100,10" 
                  fill="none" 
                  stroke="#0074D9" 
                  strokeWidth="2"
                  filter="url(#lineGlow)"
                />
                <polyline 
                  points="0,40 10,35 20,38 30,25 40,30 50,15 60,20 70,10 80,5 90,15 100,10 100,45 0,45" 
                  fill="url(#lineGradient)" 
                  opacity="0.3"
                />
                <line x1="0" y1="45" x2="100" y2="45" stroke="#ccc" strokeWidth="0.5" />
                <text x="0" y="49" fontSize="3" fill="#ccc">00:00</text>
                <text x="50" y="49" fontSize="3" fill="#ccc">12:00</text>
                <text x="95" y="49" fontSize="3" fill="#ccc">24:00</text>
              </svg>
              <ChartOverlay>
                Peak: $5.2M at 14:30
              </ChartOverlay>
            </LineChartContainer>
          </CardContent>
        </ChartCard>
          </Grid>
        </ChartsSection>
      </MainContent>
      
      <Footer>
        <FooterContent>
          <MonadIcon src="/images/monad-icon.svg" alt="Monad" />
          <FooterText>Powered by Monad - The Layer 1 Blockchain for DeFi</FooterText>
        </FooterContent>
      </Footer>
    </DashboardContainer>
  );
};

export default Dashboard;
