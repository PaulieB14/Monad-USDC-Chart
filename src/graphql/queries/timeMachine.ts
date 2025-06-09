import { gql } from '@apollo/client';

// Historical Activity Replay
export const HISTORICAL_ACTIVITY_QUERY = gql`
  query HistoricalActivity($startTime: String!, $endTime: String!, $minAmount: String = "50000000000") {
    transfers(
      first: 200
      where: { 
        timestamp_gte: $startTime
        timestamp_lte: $endTime
        value_gt: $minAmount
      }
      orderBy: timestamp
    ) {
      id
      value
      timestamp
      block
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

// Hourly Activity Buckets (Last 24h)
export const HOURLY_ACTIVITY_QUERY = gql`
  query HourlyActivity($since: String!) {
    transfers(
      first: 1000
      where: { timestamp_gt: $since }
      orderBy: timestamp
    ) {
      value
      timestamp
      from {
        address
      }
      to {
        address
      }
    }
  }
`;

// Paginated Transfers for Performance
export const PAGINATED_TRANSFERS_QUERY = gql`
  query PaginatedTransfers($skip: Int = 0, $first: Int = 20) {
    transfers(
      first: $first
      skip: $skip
      where: { value_gt: "10000000000" }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      value
      timestamp
      from {
        address
      }
      to {
        address
      }
    }
  }
`;

// Mobile-Optimized Whale Feed
export const MOBILE_WHALE_FEED_QUERY = gql`
  query MobileWhaleFeed {
    transfers(
      first: 10
      where: { value_gt: "100000000000" }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      value
      timestamp
      from {
        address
      }
      to {
        address
      }
    }
  }
`;
