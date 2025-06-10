import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled, { keyframes, css } from 'styled-components';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../styles';
import { WHALE_ALERTS_QUERY } from '../../graphql/queries/whaleAlerts';
import { formatAddress, WHALE_THRESHOLDS, MONAD_EXPLORER, BLOCKCHAIN_INFO, REFRESH_SETTINGS } from '../../config';
import { formatUSDCAmount } from '../../utils/formatters'; // Use the corrected 6-decimal formatter

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;

// Styled Components
const AlertContainer = styled.div`
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

const AlertItem = styled.div<{ $severity: 'HIGH' | 'MEDIUM' | 'LOW' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  border-left: 4px solid ${props => 
    props.$severity === 'HIGH' ? '#ff4136' :
    props.$severity === 'MEDIUM' ? '#ffdc00' :
    '#2ecc40'
  };
  background: ${props => 
    props.$severity === 'HIGH' ? 'rgba(255, 65, 54, 0.1)' :
    props.$severity === 'MEDIUM' ? 'rgba(255, 220, 0, 0.1)' :
    'rgba(46, 204, 64, 0.1)'
  };
  
  animation: ${slideIn} 0.5s ease-out;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => 
      props.$severity === 'HIGH' ? 'rgba(255, 65, 54, 0.15)' :
      props.$severity === 'MEDIUM' ? 'rgba(255, 220, 0, 0.15)' :
      'rgba(46, 204, 64, 0.15)'
    };
    transform: translateX(2px);
    cursor: pointer;
  }
`;

const AlertIcon = styled.div<{ $severity: 'HIGH' | 'MEDIUM' | 'LOW' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
  color: white;
  
  background: ${props => 
    props.$severity === 'HIGH' ? '#ff4136' :
    props.$severity === 'MEDIUM' ? '#ffdc00' :
    '#2ecc40'
  };
  
  ${props => props.$severity === 'HIGH' && css`
    animation: ${pulse} 2s infinite;
  `}
`;

const AlertContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const AlertAmount = styled.div<{ $severity: 'HIGH' | 'MEDIUM' | 'LOW' }>`
  font-weight: bold;
  font-size: 16px;
  color: ${props => 
    props.$severity === 'HIGH' ? '#ff4136' :
    props.$severity === 'MEDIUM' ? '#ffdc00' :
    '#2ecc40'
  };
`;

const AlertDetails = styled.div`
  font-size: 12px;
  color: #8b93a6;
  margin-top: 2px;
`;

const StatusIndicator = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${props => props.$connected ? '#2ecc40' : '#ffdc00'};
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.$connected ? '#2ecc40' : '#ffdc00'};
    ${props => props.$connected && css`
      animation: ${pulse} 2s infinite;
    `}
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

const ExplorerBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #8b93a6;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
`;

// Types
interface Transfer {
  id: string;
  transaction: string;
  timestamp: string;
  value: string;
  from: {
    address: string;
    balance: string;
  };
  to: {
    address: string;
    balance: string;
  };
}

// Helper functions - CORRECTED to use 6 decimals
const getSeverity = (value: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
  // CORRECTED: Use 6 decimals as confirmed by MonadExplorer contract verification
  const numValue = parseFloat(value) / Math.pow(10, 6);
  if (numValue >= WHALE_THRESHOLDS.LARGE) return 'HIGH';
  if (numValue >= WHALE_THRESHOLDS.MEDIUM) return 'MEDIUM';
  return 'LOW';
};

const getTimeAgo = (timestamp: string): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - parseInt(timestamp);
  
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const getIconEmoji = (severity: 'HIGH' | 'MEDIUM' | 'LOW'): string => {
  switch (severity) {
    case 'HIGH': return '🚨';
    case 'MEDIUM': return '⚠️';
    case 'LOW': return '💰';
    default: return '💸';
  }
};

// Main Component
const LiveWhaleAlertStream: React.FC = () => {
  const [alertCount, setAlertCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Query for whale transfers - NO auto-polling
  // CORRECTED: Update minAmount calculation to use 6 decimals for subgraph query
  const { data, loading, error, refetch } = useQuery(WHALE_ALERTS_QUERY, {
    variables: {
      // Convert threshold to 6-decimal format for subgraph query
      minAmount: (WHALE_THRESHOLDS.SMALL * Math.pow(10, 6)).toString()
    },
    // No pollInterval - manual refresh only
    errorPolicy: 'ignore',
    onCompleted: () => setLastUpdated(new Date()),
  });

  // Update alert count when data changes
  useEffect(() => {
    if (data?.transfers) {
      setAlertCount(data.transfers.length);
    }
  }, [data]);

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Whale Alerts</CardTitle>
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
          <CardTitle>Live Whale Alerts</CardTitle>
          <Badge $variant="danger">Connection Error</Badge>
        </CardHeader>
        <CardContent>
          <div style={{ 
            textAlign: 'center', 
            padding: '20px', 
            color: '#ff4136'
          }}>
            <div style={{ marginBottom: '12px' }}>⚠️</div>
            <div style={{ marginBottom: '8px' }}>Failed to connect to subgraph</div>
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
              Retry Connection
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const transfers = data?.transfers || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          🚨 Whale Alerts
          <StatusIndicator $connected={!loading && !error}>
            {!loading && !error ? 'Data Loaded' : 'Loading...'}
          </StatusIndicator>
        </CardTitle>
        <Badge $variant={transfers.length > 0 ? 'warning' : 'success'}>
          {alertCount} Found
        </Badge>
      </CardHeader>
      <CardContent>
        <RefreshControls>
          <RefreshButton onClick={handleRefresh} disabled={loading}>
            🔄 {loading ? 'Refreshing...' : 'Refresh Alerts'}
          </RefreshButton>
          {lastUpdated && (
            <LastUpdated>
              Updated: {lastUpdated.toLocaleTimeString()}
            </LastUpdated>
          )}
        </RefreshControls>
        
        <AlertContainer>
          {transfers.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐋</div>
              <div style={{ marginBottom: '8px' }}>No whale transfers found</div>
              <div style={{ fontSize: '12px' }}>
                Searching for transfers ${WHALE_THRESHOLDS.SMALL.toLocaleString()}+ on {BLOCKCHAIN_INFO.NAME}
              </div>
              <div style={{ fontSize: '10px', marginTop: '8px', color: '#8b93a6' }}>
                Click refresh to check for new activity
              </div>
            </EmptyState>
          ) : (
            transfers.map((transfer: Transfer) => {
              const severity = getSeverity(transfer.value);
              return (
                <AlertItem
                  key={transfer.id}
                  $severity={severity}
                  onClick={() => window.open(MONAD_EXPLORER.TRANSACTION(transfer.transaction), '_blank')}
                  title={`Click to view on ${BLOCKCHAIN_INFO.EXPLORER_NAME}`}
                >
                  <AlertIcon $severity={severity}>
                    {getIconEmoji(severity)}
                  </AlertIcon>
                  <AlertContent>
                    <AlertAmount $severity={severity}>
                      {formatUSDCAmount(transfer.value)}
                    </AlertAmount>
                    <AlertDetails>
                      {formatAddress(transfer.from.address)} → {formatAddress(transfer.to.address)}
                      <br />
                      {getTimeAgo(transfer.timestamp)}
                      <ExplorerBadge>
                        📋 View on {BLOCKCHAIN_INFO.EXPLORER_NAME}
                      </ExplorerBadge>
                    </AlertDetails>
                  </AlertContent>
                </AlertItem>
              );
            })
          )}
        </AlertContainer>
      </CardContent>
    </Card>
  );
};

export default LiveWhaleAlertStream;