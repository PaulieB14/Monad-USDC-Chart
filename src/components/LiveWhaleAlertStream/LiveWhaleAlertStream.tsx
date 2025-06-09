import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { WHALE_ALERTS_QUERY } from '../../graphql/queries';
import type { WhaleAlertsResponse } from '../../graphql/types';
import { Card, CardHeader, CardTitle, CardContent, Button, Flex, Text, LoadingContainer, Spinner } from '../../styles';
import { playWhaleAlertSound } from '../../utils';
import { toUSDCAmount } from '../../config';
import WhaleAlert from './WhaleAlert';

// Styled components
const AlertsContainer = styled.div`
  max-height: 250px;
  overflow-y: auto;
  padding-right: var(--spacing-sm);
`;

const FilterButton = styled(Button)<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
`;

// LiveWhaleAlertStream component
const LiveWhaleAlertStream: React.FC = () => {
  // State for minimum amount filter
  const [minAmount, setMinAmount] = useState('50000000000'); // $50K in USDC (6 decimals)
  
  // Query for whale alerts
  const { loading, error, data, refetch } = useQuery<WhaleAlertsResponse>(WHALE_ALERTS_QUERY, {
    variables: { minAmount },
    pollInterval: 30000, // Poll every 30 seconds for new data
  });
  
  // Play sound effect when new whale alerts come in
  useEffect(() => {
    if (data?.transfers && data.transfers.length > 0) {
      // Play sound for the most recent transfer
      playWhaleAlertSound(data.transfers[0].value);
    }
  }, [data]);
  
  // Filter buttons for different whale sizes
  const filterOptions = [
    { label: 'All Whales ($50K+)', value: toUSDCAmount(50000) },
    { label: 'Medium Whales ($250K+)', value: toUSDCAmount(250000) },
    { label: 'Mega Whales ($1M+)', value: toUSDCAmount(1000000) },
  ];
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setMinAmount(value);
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    refetch({ minAmount });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Whale Alert Stream</CardTitle>
        <Button $variant="outline" onClick={handleRefresh}>
          Refresh
        </Button>
      </CardHeader>
      
      <Flex $justify="flex-start" $gap="var(--spacing-sm)" style={{ marginBottom: 'var(--spacing-md)' }}>
        {filterOptions.map((option) => (
          <FilterButton
            key={option.value}
            $variant="text"
            $active={minAmount === option.value}
            onClick={() => handleFilterChange(option.value)}
          >
            {option.label}
          </FilterButton>
        ))}
      </Flex>
      
      <CardContent>
        {loading && (
          <LoadingContainer>
            <Spinner />
            <Text>Loading whale alerts...</Text>
          </LoadingContainer>
        )}
        
        {error && (
          <EmptyState>
            <Text $size="lg">Error loading whale alerts</Text>
            <Text $size="sm" $color="var(--color-text-secondary)">
              {error.message}
            </Text>
            <Button $variant="primary" onClick={handleRefresh} style={{ marginTop: 'var(--spacing-md)' }}>
              Try Again
            </Button>
          </EmptyState>
        )}
        
        {!loading && !error && data?.transfers && data.transfers.length === 0 && (
          <EmptyState>
            <Text $size="lg">No whale alerts found</Text>
            <Text $size="sm" $color="var(--color-text-secondary)">
              Try adjusting your filters or check back later
            </Text>
          </EmptyState>
        )}
        
        {!loading && !error && data?.transfers && data.transfers.length > 0 && (
          <AlertsContainer>
            {data.transfers.map((transfer) => (
              <WhaleAlert key={transfer.id} transfer={transfer} />
            ))}
          </AlertsContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveWhaleAlertStream;
