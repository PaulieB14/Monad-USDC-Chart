import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { WHALE_LEADERBOARD_QUERY, WHALE_ACTIVITY_QUERY } from '../../graphql/queries';
import type { WhaleLeaderboardResponse, WhaleActivityResponse } from '../../graphql/types';
import { Card, CardHeader, CardTitle, CardContent, Button, Flex, Text, LoadingContainer, Spinner } from '../../styles';
import { formatExactUSDCAmount, formatRelativeTime, shortenAddress, getAddressLabel } from '../../utils';
import { toUSDCAmount, ONE_DAY_AGO } from '../../config';

// Styled components
const LeaderboardTable = styled.div`
  width: 100%;
  border-collapse: collapse;
  max-height: 300px;
  overflow-y: auto;
  display: block;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr 120px;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  color: var(--color-text-secondary);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr 120px;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: rgba(0, 136, 204, 0.05);
  }
`;

const RankCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const AddressCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  position: relative;
  
  &:hover {
    .copy-tooltip {
      opacity: 1;
    }
  }
`;

const CopyTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
`;

const AddressCopyButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0;
  font-size: var(--font-size-xs);
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const AddressLabel = styled.span`
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
`;

const BalanceCell = styled.div`
  display: flex;
  align-items: center;
  font-family: monospace;
  font-weight: 500;
`;

const ActivityCell = styled.div`
  display: flex;
  align-items: center;
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const FilterButton = styled(Button)<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`;

// Modal for whale details
const DetailsModal = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius-lg);
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  padding: var(--spacing-lg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: var(--color-text-secondary);
  
  &:hover {
    color: var(--color-text);
  }
`;

const TransactionList = styled.div`
  margin-top: var(--spacing-md);
`;

const TransactionItem = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionDirection = styled.div<{ $isInflow: boolean }>`
  color: ${({ $isInflow }) => ($isInflow ? 'var(--color-success)' : 'var(--color-danger)')};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const TransactionAmount = styled.div`
  font-family: monospace;
  font-weight: 500;
`;

const TransactionTime = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const ActivityStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const StatCard = styled.div`
  background-color: var(--color-background-lighter);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

// WhaleLeaderboard component
const WhaleLeaderboard: React.FC = () => {
  // State for minimum balance filter
  const [minBalance, setMinBalance] = useState(toUSDCAmount(100000)); // $100K in USDC (6 decimals)
  // State for selected whale details
  const [selectedWhale, setSelectedWhale] = useState<string | null>(null);
  // State for copy tooltip
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  // Timeout ref for copy tooltip
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Query for whale leaderboard
  const { loading, error, data, refetch } = useQuery<WhaleLeaderboardResponse>(WHALE_LEADERBOARD_QUERY, {
    variables: { minBalance },
    pollInterval: 60000, // Poll every 60 seconds for new data
  });
  
  // Query for selected whale activity
  const { data: activityData, loading: activityLoading } = useQuery<WhaleActivityResponse>(WHALE_ACTIVITY_QUERY, {
    variables: { 
      whaleAddress: selectedWhale || '', 
      since: ONE_DAY_AGO 
    },
    skip: !selectedWhale,
  });
  
  // Filter buttons for different whale sizes
  const filterOptions = [
    { label: 'All Whales ($100K+)', value: toUSDCAmount(100000) },
    { label: 'Medium Whales ($1M+)', value: toUSDCAmount(1000000) },
    { label: 'Mega Whales ($10M+)', value: toUSDCAmount(10000000) },
  ];
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setMinBalance(value);
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    refetch({ minBalance });
  };
  
  // Handle view details
  const handleViewDetails = (address: string) => {
    setSelectedWhale(address);
  };
  
  // Handle close modal
  const handleCloseModal = () => {
    setSelectedWhale(null);
  };
  
  // Handle copy address
  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the view details
    navigator.clipboard.writeText(address);
    
    // Clear any existing timeout
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    
    // Show the copied tooltip
    setCopiedAddress(address);
    
    // Hide the tooltip after 2 seconds
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };
  
  // Calculate last activity time
  const getLastActivity = (account: any): string => {
    const fromTime = account.transfersFrom[0]?.timestamp;
    const toTime = account.transfersTo[0]?.timestamp;
    
    if (!fromTime && !toTime) return 'Never';
    
    if (!fromTime) return formatRelativeTime(toTime);
    if (!toTime) return formatRelativeTime(fromTime);
    
    // Return the most recent activity
    return formatRelativeTime(
      parseInt(fromTime) > parseInt(toTime) ? fromTime : toTime
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Whale Leaderboard</CardTitle>
        <Button $variant="outline" onClick={handleRefresh}>
          Refresh
        </Button>
      </CardHeader>
      
      <Flex $justify="flex-start" $gap="var(--spacing-sm)" style={{ marginBottom: 'var(--spacing-md)' }}>
        {filterOptions.map((option) => (
          <FilterButton
            key={option.value}
            $variant="text"
            $active={minBalance === option.value}
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
            <Text>Loading whale leaderboard...</Text>
          </LoadingContainer>
        )}
        
        {error && (
          <Flex $direction="column" $align="center" $justify="center" style={{ padding: 'var(--spacing-xl)' }}>
            <Text $size="lg">Error loading whale leaderboard</Text>
            <Text $size="sm" $color="var(--color-text-secondary)">
              {error.message}
            </Text>
            <Button $variant="primary" onClick={handleRefresh} style={{ marginTop: 'var(--spacing-md)' }}>
              Try Again
            </Button>
          </Flex>
        )}
        
        {!loading && !error && data?.accounts && (
          <LeaderboardTable>
            <TableHeader>
              <Text $size="sm">Rank</Text>
              <Text $size="sm">Address</Text>
              <Text $size="sm">Balance</Text>
              <Text $size="sm">Last Activity</Text>
              <Text $size="sm" $align="right">Actions</Text>
            </TableHeader>
            
            {data.accounts.map((account, index) => (
              <TableRow key={account.id}>
                <RankCell>
                  <Text>{index + 1}</Text>
                </RankCell>
                
                <AddressCell onClick={() => handleViewDetails(account.address)}>
                  <AddressLabel>{getAddressLabel(account.address)}</AddressLabel>
                  <Text>{shortenAddress(account.address)}</Text>
                  <AddressCopyButton 
                    onClick={(e) => handleCopyAddress(account.address, e)}
                    title="Copy full address"
                  >
                    📋
                  </AddressCopyButton>
                  {copiedAddress === account.address && (
                    <CopyTooltip className="copy-tooltip">Address copied!</CopyTooltip>
                  )}
                </AddressCell>
                
                <BalanceCell>
                  <Text>{formatExactUSDCAmount(account.balance)}</Text>
                </BalanceCell>
                
                <ActivityCell>
                  <Text $size="sm" $color="var(--color-text-secondary)">
                    {getLastActivity(account)}
                  </Text>
                </ActivityCell>
                
                <ActionCell>
                  <Button 
                    $variant="text" 
                    onClick={() => handleViewDetails(account.address)}
                  >
                    View Details
                  </Button>
                </ActionCell>
              </TableRow>
            ))}
          </LeaderboardTable>
        )}
      </CardContent>
      
      {/* Whale Details Modal */}
      <DetailsModal $visible={!!selectedWhale}>
        <ModalContent>
          {selectedWhale && (
            <>
              <ModalHeader>
                <div>
                  <Text $size="xl" $weight="bold">Whale Details</Text>
                  <Flex $align="center" $gap="var(--spacing-sm)">
                    <AddressLabel>{getAddressLabel(selectedWhale)}</AddressLabel>
                    <Text>{selectedWhale}</Text>
                    <AddressCopyButton 
                      onClick={(e) => handleCopyAddress(selectedWhale, e)}
                      title="Copy full address"
                    >
                      📋
                    </AddressCopyButton>
                    {copiedAddress === selectedWhale && (
                      <CopyTooltip className="copy-tooltip">Address copied!</CopyTooltip>
                    )}
                  </Flex>
                </div>
                <CloseButton onClick={handleCloseModal}>×</CloseButton>
              </ModalHeader>
              
              {activityLoading ? (
                <LoadingContainer>
                  <Spinner />
                  <Text>Loading whale details...</Text>
                </LoadingContainer>
              ) : activityData?.account ? (
                <>
                  <Text $size="lg" $weight="bold" style={{ marginTop: 'var(--spacing-md)' }}>
                    Current Balance
                  </Text>
                  <Text $size="xl" style={{ fontFamily: 'monospace', marginBottom: 'var(--spacing-md)' }}>
                    {formatExactUSDCAmount(activityData.account.balance)}
                  </Text>
                  
                  <ActivityStats>
                    <StatCard>
                      <StatValue>
                        {activityData.account.transfersTo.length}
                      </StatValue>
                      <StatLabel>Inbound Transfers (24h)</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>
                        {activityData.account.transfersFrom.length}
                      </StatValue>
                      <StatLabel>Outbound Transfers (24h)</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>
                        <a 
                          href={`https://monad-testnet.socialscan.io/address/${selectedWhale}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          View on Explorer
                        </a>
                      </StatValue>
                      <StatLabel>Blockchain Explorer</StatLabel>
                    </StatCard>
                  </ActivityStats>
                  
                  <Text $size="lg" $weight="bold">Recent Activity</Text>
                  <TransactionList>
                    {activityData.account.transfersTo.map((transfer: any) => (
                      <TransactionItem key={transfer.id}>
                        <TransactionDirection $isInflow={true}>
                          ↓ Received from {shortenAddress(transfer.from.address)}
                        </TransactionDirection>
                        <TransactionAmount>
                          {formatExactUSDCAmount(transfer.value)}
                        </TransactionAmount>
                        <TransactionTime>
                          {formatRelativeTime(transfer.timestamp)}
                        </TransactionTime>
                      </TransactionItem>
                    ))}
                    
                    {activityData.account.transfersFrom.map((transfer: any) => (
                      <TransactionItem key={transfer.id}>
                        <TransactionDirection $isInflow={false}>
                          ↑ Sent to {shortenAddress(transfer.to.address)}
                        </TransactionDirection>
                        <TransactionAmount>
                          {formatExactUSDCAmount(transfer.value)}
                        </TransactionAmount>
                        <TransactionTime>
                          {formatRelativeTime(transfer.timestamp)}
                        </TransactionTime>
                      </TransactionItem>
                    ))}
                    
                    {activityData.account.transfersTo.length === 0 && 
                     activityData.account.transfersFrom.length === 0 && (
                      <Flex $direction="column" $align="center" $justify="center" style={{ padding: 'var(--spacing-xl)' }}>
                        <Text $size="md">No recent activity in the last 24 hours</Text>
                      </Flex>
                    )}
                  </TransactionList>
                </>
              ) : (
                <Flex $direction="column" $align="center" $justify="center" style={{ padding: 'var(--spacing-xl)' }}>
                  <Text $size="lg">No data available for this address</Text>
                </Flex>
              )}
            </>
          )}
        </ModalContent>
      </DetailsModal>
    </Card>
  );
};

export default WhaleLeaderboard;
