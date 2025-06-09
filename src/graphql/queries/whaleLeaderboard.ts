import { gql } from '@apollo/client';

// Top USDC Holders
export const WHALE_LEADERBOARD_QUERY = gql`
  query WhaleLeaderboard($minBalance: String = "100000000000") {
    accounts(
      first: 20
      where: { balance_gt: $minBalance }
      orderBy: balance
      orderDirection: desc
    ) {
      id
      address
      balance
      transfersFrom(first: 1, orderBy: timestamp, orderDirection: desc) {
        timestamp
      }
      transfersTo(first: 1, orderBy: timestamp, orderDirection: desc) {
        timestamp
      }
    }
  }
`;

// Whale Activity Score (Recent Activity)
export const WHALE_ACTIVITY_QUERY = gql`
  query WhaleActivity($whaleAddress: String!, $since: String!) {
    account(id: $whaleAddress) {
      address
      balance
      transfersFrom(
        where: { timestamp_gt: $since }
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        value
        timestamp
        to {
          address
        }
      }
      transfersTo(
        where: { timestamp_gt: $since }
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        value
        timestamp
        from {
          address
        }
      }
    }
  }
`;

// Whale Accumulation vs Distribution
export const WHALE_FLOW_ANALYSIS_QUERY = gql`
  query WhaleFlowAnalysis($whaleAddress: String!, $since: String!) {
    inflowTransfers: transfers(
      first: 50
      where: { 
        to: $whaleAddress
        timestamp_gt: $since
      }
      orderBy: timestamp
      orderDirection: desc
    ) {
      value
      timestamp
      from {
        address
      }
    }
    
    outflowTransfers: transfers(
      first: 50
      where: { 
        from: $whaleAddress
        timestamp_gt: $since
      }
      orderBy: timestamp
      orderDirection: desc
    ) {
      value
      timestamp
      to {
        address
      }
    }
  }
`;

// Top Counterparties for Whale
export const WHALE_COUNTERPARTIES_QUERY = gql`
  query WhaleCounterparties($whaleAddress: String!, $minAmount: String = "1000000000") {
    transfersOut: transfers(
      first: 20
      where: { 
        from: $whaleAddress
        value_gt: $minAmount
      }
      orderBy: value
      orderDirection: desc
    ) {
      value
      to {
        address
        balance
      }
    }
    
    transfersIn: transfers(
      first: 20
      where: { 
        to: $whaleAddress
        value_gt: $minAmount
      }
      orderBy: value
      orderDirection: desc
    ) {
      value
      from {
        address
        balance
      }
    }
  }
`;
