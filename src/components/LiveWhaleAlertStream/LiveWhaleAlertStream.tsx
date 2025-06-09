import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled, { keyframes } from 'styled-components';
import { Card, CardHeader, CardTitle, CardContent, Badge, Text } from '../../styles';
import { WHALE_ALERTS_QUERY, LATEST_TRANSFERS_QUERY } from '../../graphql/queries/whaleAlerts';
import { formatUSDCDisplay, formatAddress, WHALE_THRESHOLDS, POLLING_INTERVALS } from '../../config';

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
    background: var(--color-primary);
    border-radius: 2px;
  }
`;

const AlertItem = styled.div<{ $severity: 'HIGH' | 'MEDIUM' | 'LOW' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-xs);
  border-left: 4px solid ${props => 
    props.$severity === 'HIGH' ? 'var(--color-danger)' :
    props.$severity === 'MEDIUM' ? 'var(--color-warning)' :
    'var(--color-success)'
  };
  background: ${props => 
    props.$severity === 'HIGH' ? 'rgba(255, 65, 54, 0.1)' :
    props.$severity === 'MEDIUM' ? 'rgba(255, 193, 7, 0.1)' :
    'rgba(40, 167, 69, 0.1)'
  };
  
  animation: ${slideIn} 0.5s ease-out;
  
  &:hover {
    background: ${props => 
      props.$severity === 'HIGH' ? 'rgba(255, 65, 54, 0.15)' :
      props.$severity === 'MEDIUM' ? 'rgba(255, 193, 7, 0.15)' :
      'rgba(40, 167, 69, 0.15)'
    };
    transform: translateX(2px);
    cursor: pointer;
  }
  
  transition: all 0.2s ease;
`;

const AlertIcon = styled.div<{ $severity: 'HIGH' | 'MEDIUM' | 'LOW' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: bold;
  flex-shrink: 0;
  
  background: ${props => 
    props.$severity === 'HIGH' ? 'var(--color-danger)' :
    props.$severity === 'MEDIUM' ? 'var(--color-warning)' :
    'var(--color-success)'
  };
  
  color: white;
  
  ${props => props.$severity === 'HIGH' && `
    animation: ${pulse} 2s infinite;
  `}
`;

const AlertContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const AlertAmount = styled.div<{ $severity: 'HIGH' | 'MEDIUM' | 'LOW' }>`
  font-weight: bold;
  font-size: var(--font-size-md);
  color: ${props => 
    props.$severity === 'HIGH' ? 'var(--color-danger)' :
    props.$severity === 'MEDIUM' ? 'var(--color-warning)' :
    'var(--color-success)'
  };
`;

const AlertDetails = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: 2px;
`;

const StatusIndicator = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: ${props => props.$connected ? 'var(--color-success)' : 'var(--color-warning)'};
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.$connected ? 'var(--color-success)' : 'var(--color-warning)'};
    animation: ${props => props.$connected ? pulse : 'none'} 2s infinite;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-secondary);
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
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
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

// Helper functions
const getSeverity = (value: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
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

  // Query for whale transfers (>$50K)
  const { data, loading, error, refetch } = useQuery(WHALE_ALERTS_QUERY, {
    variables: {
      minAmount: (WHALE_THRESHOLDS.SMALL * Math.pow(10, 6)).toString()
    },
    pollInterval: POLLING_INTERVALS.WHALE_TRANSFERS,
    errorPolicy: 'ignore',
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
            padding: 'var(--spacing-lg)', 
            color: 'var(--color-danger)'
          }}>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>⚠️</div>
            <div style={{ marginBottom: 'var(--spacing-xs)' }}>Failed to connect to subgraph</div>
            <button 
              onClick={handleRefresh}
              style={{
                background: 'var(--color-primary)',
                border: 'none',
                color: 'white',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-xs)'
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
          Live Whale Alerts
          <StatusIndicator $connected={!loading && !error}>
            {!loading && !error ? 'Live' : 'Connecting...'}
          </StatusIndicator>
        </CardTitle>
        <Badge $variant={transfers.length > 0 ? 'warning' : 'success'}>
          {alertCount} Active
        </Badge>
      </CardHeader>
      <CardContent>
        <AlertContainer>
          {transfers.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-sm)' }}>🐋</div>
              <div style={{ marginBottom: 'var(--spacing-xs)' }}>No recent whale activity</div>
              <div style={{ fontSize: 'var(--font-size-xs)' }}>
                Monitoring for transfers ${WHALE_THRESHOLDS.SMALL.toLocaleString()}+
              </div>
            </EmptyState>
          ) : (
            transfers.map((transfer: Transfer) => {
              const severity = getSeverity(transfer.value);
              return (
                <AlertItem
                  key={transfer.id}
                  $severity={severity}
                  onClick={() => window.open(`https://etherscan.io/tx/${transfer.transaction}`, '_blank')}
                  title="Click to view on Etherscan"
                >
                  <AlertIcon $severity={severity}>
                    {getIconEmoji(severity)}
                  </AlertIcon>
                  <AlertContent>
                    <AlertAmount $severity={severity}>
                      {formatUSDCDisplay(transfer.value)}
                    </AlertAmount>
                    <AlertDetails>
                      {formatAddress(transfer.from.address)} → {formatAddress(transfer.to.address)}
                      <br />
                      {getTimeAgo(transfer.timestamp)}
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
