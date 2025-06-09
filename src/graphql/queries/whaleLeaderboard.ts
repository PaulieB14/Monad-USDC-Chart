import { gql } from '@apollo/client';

// Top USDC Holders (Whale Leaderboard)
export const WHALE_LEADERBOARD_QUERY = gql`
  query WhaleLeaderboard($first: Int = 20) {
    accounts(
      first: $first
      orderBy: balance
      orderDirection: desc
      where: { balance_gt: "0" }
    ) {
      id
      address
      balance
      transfersFrom(first: 5, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        value
        to {
          address
        }
      }
      transfersTo(first: 5, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        value
        from {
          address
        }
      }
    }
  }
`;

// Top Whale Activity (accounts with recent large transfers)
export const WHALE_ACTIVITY_QUERY = gql`
  query WhaleActivity($since: BigInt!, $minBalance: BigInt = "1000000000000") {
    accounts(
      first: 50
      orderBy: balance
      orderDirection: desc
      where: { balance_gte: $minBalance }
    ) {
      id
      address
      balance
      transfersFrom(
        first: 10
        orderBy: timestamp
        orderDirection: desc
        where: { timestamp_gte: $since }
      ) {
        id
        timestamp
        value
        to {
          address
        }
      }
      transfersTo(
        first: 10
        orderBy: timestamp
        orderDirection: desc
        where: { timestamp_gte: $since }
      ) {
        id
        timestamp
        value
        from {
          address
        }
      }
    }
  }
`;

// Whale Balance Changes Over Time
export const WHALE_BALANCE_CHANGES_QUERY = gql`
  query WhaleBalanceChanges($addresses: [String!]!, $since: BigInt!) {
    transfers(
      where: {
        or: [
          { from_in: $addresses, timestamp_gte: $since }
          { to_in: $addresses, timestamp_gte: $since }
        ]
      }
      orderBy: timestamp
      orderDirection: desc
      first: 100
    ) {
      id
      timestamp
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

// Most Active Whales (by transfer count)
export const MOST_ACTIVE_WHALES_QUERY = gql`
  query MostActiveWhales($since: BigInt!, $minBalance: BigInt = "1000000000000") {
    accounts(
      first: 20
      orderBy: balance
      orderDirection: desc
      where: { balance_gte: $minBalance }
    ) {
      id
      address
      balance
      transfersFrom(where: { timestamp_gte: $since }) {
        id
        value
      }
      transfersTo(where: { timestamp_gte: $since }) {
        id
        value
      }
    }
  }
`;

// New Whale Detection (accounts that recently crossed whale threshold)
export const NEW_WHALES_QUERY = gql`
  query NewWhales($since: BigInt!, $whaleThreshold: BigInt = "1000000000000") {
    accounts(
      first: 20
      orderBy: balance
      orderDirection: desc
      where: { balance_gte: $whaleThreshold }
    ) {
      id
      address
      balance
      transfersTo(
        first: 1
        orderBy: timestamp
        orderDirection: desc
        where: { 
          timestamp_gte: $since
          value_gte: "100000000000"
        }
      ) {
        id
        timestamp
        value
        from {
          address
        }
      }
    }
  }
`;

// Whale Distribution Statistics
export const WHALE_DISTRIBUTION_QUERY = gql`
  query WhaleDistribution {
    # Mega whales (>$10M)
    megaWhales: accounts(
      where: { balance_gte: "10000000000000" }
    ) {
      id
      balance
    }
    
    # Large whales ($1M-$10M)
    largeWhales: accounts(
      where: { 
        balance_gte: "1000000000000"
        balance_lt: "10000000000000"
      }
    ) {
      id
      balance
    }
    
    # Medium whales ($100K-$1M)
    mediumWhales: accounts(
      where: { 
        balance_gte: "100000000000"
        balance_lt: "1000000000000"
      }
    ) {
      id
      balance
    }
  }
`;
