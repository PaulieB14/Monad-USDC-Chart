// Utility functions for formatting data

import { format, fromUnixTime } from 'date-fns';
import { USDC_DECIMALS, SUBGRAPH_BALANCE_DECIMALS } from '../config';

// The subgraph appears to be storing values with incorrect decimals
// Based on MonadExplorer showing 0.04339 USDC for value "4339843776115987"
// This suggests the subgraph uses 18 decimals for transfers too (not 6)
const SUBGRAPH_TRANSFER_DECIMALS = 18; // Subgraph stores transfer values with 18 decimals

// Format balance from subgraph (which uses 18 decimals for balances)
export const formatBalance = (balance: string): string => {
  if (!balance) return '$0';
  
  const balanceNum = parseFloat(balance);
  
  // Handle negative balances
  if (balanceNum < 0) {
    return '$0';
  }
  
  // The subgraph stores balances with 18 decimals, not 6
  const value = balanceNum / Math.pow(10, SUBGRAPH_BALANCE_DECIMALS);
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Balance Debug: ${balance} -> $${value.toFixed(2)}`);
  }
  
  // Format based on size
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

// Get numeric balance value for calculations (using 18 decimals)
export const getBalanceValue = (balance: string): number => {
  if (!balance) return 0;
  const balanceNum = parseFloat(balance);
  if (balanceNum < 0) return 0;
  return balanceNum / Math.pow(10, SUBGRAPH_BALANCE_DECIMALS);
};

// Format USDC transfer amount (subgraph stores these with 18 decimals too, not 6!)
export const formatUSDCAmount = (amount: string): string => {
  if (!amount) return '$0';
  
  // Based on analysis: MonadExplorer shows 0.04339 for "4339843776115987"
  // This means the subgraph stores transfer values with 18 decimals, not 6
  const value = parseFloat(amount) / Math.pow(10, SUBGRAPH_TRANSFER_DECIMALS);
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`Transfer Debug: ${amount} -> $${value.toFixed(6)}`);
  }
  
  // Format based on size
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

// Format raw USDC amount to exact value with commas
export const formatExactUSDCAmount = (amount: string): string => {
  if (!amount) return '$0.00';
  
  const value = parseFloat(amount) / Math.pow(10, SUBGRAPH_TRANSFER_DECIMALS);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6 // Show more decimals for small amounts
  }).format(value);
};

// Format Unix timestamp to human-readable date/time
export const formatTimestamp = (timestamp: string): string => {
  if (!timestamp) return '';
  
  const date = fromUnixTime(parseInt(timestamp));
  return format(date, 'MMM d, yyyy h:mm a');
};

// Format Unix timestamp to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (timestamp: string): string => {
  if (!timestamp) return '';
  
  const now = Math.floor(Date.now() / 1000);
  const time = parseInt(timestamp);
  const diff = now - time;
  
  if (diff < 60) {
    return 'just now';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
};

// Get color based on USDC transfer amount (using 18 decimals)
export const getAmountColor = (amount: string): string => {
  if (!amount) return '#cccccc';
  
  const value = parseFloat(amount) / Math.pow(10, SUBGRAPH_TRANSFER_DECIMALS);
  
  if (value >= 1000000) {
    return '#FF4136'; // Red for $1M+
  } else if (value >= 250000) {
    return '#FF851B'; // Orange for $250K+
  } else if (value >= 50000) {
    return '#FFDC00'; // Yellow for $50K+
  } else {
    return '#2ECC40'; // Green for smaller amounts
  }
};

// Format percentage change
export const formatPercentChange = (value: number): string => {
  if (isNaN(value)) return '0%';
  
  const formatted = value.toFixed(2);
  if (value > 0) {
    return `+${formatted}%`;
  } else {
    return `${formatted}%`;
  }
};

// Format large numbers with abbreviations
export const formatLargeNumber = (num: number): string => {
  if (isNaN(num)) return '0';
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
};

// Format activity score (0-100)
export const formatActivityScore = (score: number): string => {
  if (isNaN(score)) return '0';
  
  return Math.min(100, Math.max(0, Math.round(score))).toString();
};