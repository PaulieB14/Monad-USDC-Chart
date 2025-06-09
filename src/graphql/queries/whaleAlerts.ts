import { gql } from '@apollo/client';

// Recent Large Transfers (>$50K)
export const WHALE_ALERTS_QUERY = gql`
  query WhaleAlerts($minAmount: String = "50000000000") {
    transfers(
      first: 20
      where: { value_gt: $minAmount }
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
      where: { value_gt: "1000000000000" }
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

// Latest Block and Activity Check for real-time updates
export const DASHBOARD_REFRESH_QUERY = gql`
  query DashboardRefresh {
    _meta {
      block {
        number
        hash
      }
    }
    
    latestTransfers: transfers(first: 5, orderBy: timestamp, orderDirection: desc) {
      timestamp
      value
    }
    
    tokens {
      transferCount
    }
  }
`;

// Activity Summary Stats
export const ACTIVITY_SUMMARY_QUERY = gql`
  query ActivitySummary($since1h: String!, $since24h: String!) {
    last1h: transfers(
      where: { timestamp_gt: $since1h }
    ) {
      id
    }
    
    last24h: transfers(
      where: { timestamp_gt: $since24h }
    ) {
      id
    }
    
    whalesLast1h: transfers(
      where: { 
        timestamp_gt: $since1h
        value_gt: "50000000000"
      }
    ) {
      id
      value
    }
  }
`;
