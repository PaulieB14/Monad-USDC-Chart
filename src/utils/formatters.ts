// Utility functions for formatting data

import { format, fromUnixTime } from 'date-fns';
import { USDC_DECIMALS } from '../config';

// Debug function to analyze balance values
const analyzeBalance = (balance: string): { original: string; asUSDC6: number; asUSDC18: number } => {
  const original = balance;
  const asUSDC6 = parseFloat(balance) / Math.pow(10, 6);
  const asUSDC18 = parseFloat(balance) / Math.pow(10, 18);
  return { original, asUSDC6, asUSDC18 };
};

// Smart balance formatter that handles incorrect decimal places
export const formatBalance = (balance: string): string => {
  if (!balance) return '$0';
  
  const balanceNum = parseFloat(balance);
  
  // Debug: Log the analysis in development
  if (process.env.NODE_ENV === 'development') {
    const analysis = analyzeBalance(balance);
    console.log('Balance Analysis:', analysis);
  }
  
  // If balance is negative, show as $0
  if (balanceNum < 0) {
    return '$0';
  }
  
  // Try different decimal interpretations to find the most reasonable one
  const as6Decimals = balanceNum / Math.pow(10, 6);
  const as18Decimals = balanceNum / Math.pow(10, 18);
  
  // Use heuristic: if 18-decimal interpretation gives reasonable values (< $1T), use it
  // Otherwise fall back to 6-decimal interpretation
  let value: number;
  
  if (as18Decimals < 1000000000000 && as18Decimals > 0.01) { // Less than $1T and more than $0.01
    value = as18Decimals;
  } else if (as6Decimals < 1000000000000 && as6Decimals > 0.01) {
    value = as6Decimals;
  } else {
    // If both seem unreasonable, try raw value
    value = balanceNum;
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

// Format USDC amount with 6 decimal places to human-readable format
export const formatUSDCAmount = (amount: string): string => {
  if (!amount) return '$0';
  
  const value = parseFloat(amount) / Math.pow(10, USDC_DECIMALS);
  
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
  
  const value = parseFloat(amount) / Math.pow(10, USDC_DECIMALS);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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

// Get color based on USDC amount
export const getAmountColor = (amount: string): string => {
  if (!amount) return '#cccccc';
  
  const value = parseFloat(amount) / Math.pow(10, USDC_DECIMALS);
  
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