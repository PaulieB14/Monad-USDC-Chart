import { gql } from '@apollo/client';

// Get Token Information
export const GET_TOKEN_INFO = gql`
  query GetTokenInfo {
    tokens(first: 1) {
      id
      name
      symbol
      decimals
      totalSupply
      transferCount
      holderCount
    }
  }
`;

// Recent Large Transfers (>$50K)
export const WHALE_ALERTS_QUERY = gql`
  query WhaleAlerts($minAmount: BigInt = "50000000000") {
    transfers(
      first: 20
      where: { value_gte: $minAmount }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      transaction
      timestamp
      block
      value
      from {
        id
        address
        balance
      }
      to {
        id
        address
        balance
      }
    }
  }
`;

// Mega Whale Alerts (>$1M)
export const MEGA_WHALE_ALERTS_QUERY = gql`
  query MegaWhaleAlerts {
    transfers(
      first: 10
      where: { value_gte: "1000000000000" }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      transaction
      timestamp
      value
      from {
        address
        balance
      }
      to {
        address  
        balance
      }
    }
  }
`;

// Latest transfers for activity monitoring
export const LATEST_TRANSFERS_QUERY = gql`
  query LatestTransfers {
    transfers(
      first: 50
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      transaction
      timestamp
      block
      value
      from {
        id
        address
        balance
      }
      to {
        id
        address
        balance
      }
    }
  }
`;

// Activity Summary Stats  
export const ACTIVITY_SUMMARY_QUERY = gql`
  query ActivitySummary($since1h: BigInt!, $since24h: BigInt!) {
    last1h: transfers(
      where: { timestamp_gte: $since1h }
    ) {
      id
      value
    }
    
    last24h: transfers(
      where: { timestamp_gte: $since24h }
    ) {
      id
      value
    }
    
    whalesLast1h: transfers(
      where: { 
        timestamp_gte: $since1h
        value_gte: "50000000000"
      }
    ) {
      id
      value
    }
    
    whalesLast24h: transfers(
      where: { 
        timestamp_gte: $since24h
        value_gte: "50000000000"
      }
    ) {
      id
      value
    }
  }
`;

// Get transfers in a time range
export const TRANSFERS_IN_RANGE_QUERY = gql`
  query TransfersInRange($startTime: BigInt!, $endTime: BigInt!, $minValue: BigInt) {
    transfers(
      where: { 
        timestamp_gte: $startTime
        timestamp_lte: $endTime
        value_gte: $minValue
      }
      orderBy: timestamp
      orderDirection: desc
      first: 100
    ) {
      id
      transaction
      timestamp
      block
      value
      from {
        id
        address
        balance
      }
      to {
        id
        address
        balance
      }
    }
  }
`;
