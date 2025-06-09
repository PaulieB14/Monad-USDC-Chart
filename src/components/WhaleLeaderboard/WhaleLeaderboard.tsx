import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Card, CardHeader, CardTitle, CardContent, Badge, Text } from '../../styles';
import { WHALE_LEADERBOARD_QUERY, WHALE_DISTRIBUTION_QUERY } from '../../graphql/queries/whaleLeaderboard';
import { formatAddress, formatLargeNumber, MONAD_EXPLORER, BLOCKCHAIN_INFO } from '../../config';
import { formatBalance, getBalanceValue } from '../../utils'; // Use correct balance functions

// Styled Components
const LeaderboardContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #836ef9;
    border-radius: 2px;
  }
`;

const RefreshControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const RefreshButton = styled.button`
  background: rgba(131, 110, 249, 0.1);
  border: 1px solid rgba(131, 110, 249, 0.3);
  color: #836ef9;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(131, 110, 249, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LastUpdated = styled.div`
  font-size: 10px;
  color: #8b93a6;
`;

const WhaleItem = styled.div<{ $rank: number }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  background: ${props => 
    props.$rank === 1 ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))' :
    props.$rank === 2 ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.1), rgba(192, 192, 192, 0.05))' :
    props.$rank === 3 ? 'linear-gradient(135deg, rgba(205, 127, 50, 0.1), rgba(205, 127, 50, 0.05))' :
    'rgba(255, 255, 255, 0.02)'
  };
  border: 1px solid ${props => 
    props.$rank <= 3 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'
  };
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(2px);
    cursor: pointer;
  }
  
  transition: all 0.2s ease;
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
  
  background: ${props => 
    props.$rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
    props.$rank === 2 ? 'linear-gradient(135deg, #C0C0C0, #808080)' :
    props.$rank === 3 ? 'linear-gradient(135deg, #CD7F32, #8B4513)' :
    '#836ef9'
  };
  color: ${props => props.$rank <= 3 ? 'black' : 'white'};
  
  ${props => props.$rank <= 3 && `
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  `}
`;

const WhaleInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WhaleAddress = styled.div`
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 2px;
`;

const WhaleBalance = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #836ef9;
`;

const WhaleDetails = styled.div`
  font-size: 12px;
  color: #8b93a6;
`;

const ExplorerHint = styled.div`
  font-size: 10px;
  color: #8b93a6;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #836ef9;
`;

const StatLabel = styled.div`
  font-size: 10px;
  color: #8b93a6;
  margin-top: 2px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  
  &::after {
    content: '';
    width: 30px;
    height: 30px;
    border: 3px solid rgba(131, 110, 249, 0.3);
    border-top: 3px solid #836ef9;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #8b93a6;
  text-align: center;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#836ef9' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#836ef9' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'white' : '#8b93a6'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$active ? '#836ef9' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$active ? 'white' : '#ffffff'};
  }
`;

// Types
interface Account {
  id: string;
  address: string;
  balance: string;
  transfersFrom: any[];
  transfersTo: any[];
}

// Helper functions
const getWhaleEmoji = (rank: number): string => {
  if (rank === 1) return '👑';
  if (rank <= 3) return '🐋';
  if (rank <= 10) return '🐳';
  return '🐟';
};

const getWhaleCategory = (balance: string): string => {
  const value = getBalanceValue(balance); // Use consistent balance calculation
  
  if (value >= 10000000) return 'Mega Whale';
  if (value >= 1000000) return 'Large Whale';
  if (value >= 100000) return 'Medium Whale';
  return 'Small Holder';
};

// Main Component
const WhaleLeaderboard: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'MEGA' | 'LARGE' | 'MEDIUM'>('ALL');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Query for top holders - NO auto-polling
  const { data, loading, error, refetch } = useQuery(WHALE_LEADERBOARD_QUERY, {
    variables: { first: 50 },
    // No pollInterval - manual refresh only
    errorPolicy: 'ignore',
    onCompleted: () => setLastUpdated(new Date()),
  });

  // Query for whale distribution stats - NO auto-polling
  const { data: statsData, refetch: refetchStats } = useQuery(WHALE_DISTRIBUTION_QUERY, {
    // No pollInterval - manual refresh only
    errorPolicy: 'ignore',
  });

  // Manual refresh function
  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Whale Leaderboard</CardTitle>
          <Badge $variant="info">Loading...</Badge>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Whale Leaderboard</CardTitle>
          <Badge $variant="danger">Error</Badge>
        </CardHeader>
        <CardContent>
          <div style={{ 
            textAlign: 'center', 
            padding: '20px', 
            color: '#ff4136'
          }}>
            <div style={{ marginBottom: '12px' }}>⚠️</div>
            <div style={{ marginBottom: '8px' }}>Failed to load leaderboard</div>
            <button 
              onClick={handleRefresh}
              style={{
                background: '#836ef9',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const accounts = data?.accounts || [];
  
  // Filter accounts using correct balance calculation
  const filteredAccounts = accounts.filter((account: Account) => {
    const balance = getBalanceValue(account.balance); // Use consistent balance calculation
    
    switch (filter) {
      case 'MEGA': return balance >= 10000000;
      case 'LARGE': return balance >= 1000000 && balance < 10000000;
      case 'MEDIUM': return balance >= 100000 && balance < 1000000;
      default: return balance >= 10000; // Show whales with at least $10K
    }
  });

  // Calculate stats with better number formatting
  const stats = {
    megaWhales: statsData?.megaWhales?.length || 0,
    largeWhales: statsData?.largeWhales?.length || 0,
    mediumWhales: statsData?.mediumWhales?.length || 0,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Whale Leaderboard</CardTitle>
        <Badge $variant="success">
          {formatLargeNumber(filteredAccounts.length)} Whales
        </Badge>
      </CardHeader>
      <CardContent>
        <RefreshControls>
          <RefreshButton onClick={handleRefresh} disabled={loading}>
            🔄 {loading ? 'Refreshing...' : 'Refresh Rankings'}
          </RefreshButton>
          {lastUpdated && (
            <LastUpdated>
              Updated: {lastUpdated.toLocaleTimeString()}
            </LastUpdated>
          )}
        </RefreshControls>

        {/* Stats Overview */}
        <StatsContainer>
          <StatItem>
            <StatValue>{formatLargeNumber(stats.megaWhales)}</StatValue>
            <StatLabel>Mega Whales<br />($10M+)</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatLargeNumber(stats.largeWhales)}</StatValue>
            <StatLabel>Large Whales<br />($1M-$10M)</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatLargeNumber(stats.mediumWhales)}</StatValue>
            <StatLabel>Medium Whales<br />($100K-$1M)</StatLabel>
          </StatItem>
        </StatsContainer>

        {/* Filter Buttons */}
        <FilterButtons>
          <FilterButton 
            $active={filter === 'ALL'}
            onClick={() => setFilter('ALL')}
          >
            All Whales
          </FilterButton>
          <FilterButton 
            $active={filter === 'MEGA'}
            onClick={() => setFilter('MEGA')}
          >
            Mega ($10M+)
          </FilterButton>
          <FilterButton 
            $active={filter === 'LARGE'}
            onClick={() => setFilter('LARGE')}
          >
            Large ($1M+)
          </FilterButton>
          <FilterButton 
            $active={filter === 'MEDIUM'}
            onClick={() => setFilter('MEDIUM')}
          >
            Medium ($100K+)
          </FilterButton>
        </FilterButtons>

        {/* Leaderboard */}
        <LeaderboardContainer>
          {filteredAccounts.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐋</div>
              <div style={{ marginBottom: '8px' }}>No whales found in this category</div>
              <div style={{ fontSize: '12px' }}>
                Try a different filter or click refresh to check for new data
              </div>
            </EmptyState>
          ) : (
            filteredAccounts.map((account: Account, index: number) => {
              const rank = index + 1;
              const recentActivity = account.transfersFrom.length + account.transfersTo.length;
              
              return (
                <WhaleItem
                  key={account.id}
                  $rank={rank}
                  onClick={() => window.open(MONAD_EXPLORER.ADDRESS(account.address), '_blank')}
                  title={`Click to view on ${BLOCKCHAIN_INFO.EXPLORER_NAME}`}
                >
                  <RankBadge $rank={rank}>
                    {rank <= 10 ? rank : getWhaleEmoji(rank)}
                  </RankBadge>
                  <WhaleInfo>
                    <WhaleAddress>
                      {formatAddress(account.address)}
                    </WhaleAddress>
                    <WhaleBalance>
                      {formatBalance(account.balance)}
                    </WhaleBalance>
                    <WhaleDetails>
                      {getWhaleCategory(account.balance)} • {recentActivity} recent transfers
                    </WhaleDetails>
                    <ExplorerHint>
                      📋 View on {BLOCKCHAIN_INFO.EXPLORER_NAME}
                    </ExplorerHint>
                  </WhaleInfo>
                </WhaleItem>
              );
            })
          )}
        </LeaderboardContainer>
      </CardContent>
    </Card>
  );
};

export default WhaleLeaderboard;