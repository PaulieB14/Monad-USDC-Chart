import { gql } from '@apollo/client';

// Major Money Flows (Last 6 Hours)
export const MONEY_FLOWS_QUERY = gql`
  query MoneyFlows($since: String!, $minAmount: String = "10000000000") {
    transfers(
      first: 100
      where: { 
        timestamp_gt: $since
        value_gt: $minAmount
      }
      orderBy: value
      orderDirection: desc
    ) {
      id
      value
      timestamp
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

// Flow Between Specific Addresses
export const ADDRESS_FLOW_QUERY = gql`
  query AddressFlow($address1: String!, $address2: String!, $since: String!) {
    transfers(
      where: {
        timestamp_gt: $since
        or: [
          { from: $address1, to: $address2 }
          { from: $address2, to: $address1 }
        ]
      }
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

// USDC Velocity Calculation
export const USDC_VELOCITY_QUERY = gql`
  query USDCVelocity($since: String!) {
    transfers(
      first: 1000
      where: { timestamp_gt: $since }
      orderBy: timestamp
      orderDirection: desc
    ) {
      value
      timestamp
    }
    
    tokens {
      totalSupply
    }
  }
`;

// Transfer Volume by Time Buckets
export const VOLUME_ANALYSIS_QUERY = gql`
  query VolumeAnalysis($since: String!) {
    transfers(
      first: 500
      where: { timestamp_gt: $since }
      orderBy: timestamp
    ) {
      value
      timestamp
      block
    }
  }
`;

// Distribution Health Check
export const DISTRIBUTION_HEALTH_QUERY = gql`
  query DistributionHealth {
    accounts(
      first: 100
      orderBy: balance
      orderDirection: desc
      where: { balance_gt: "0" }
    ) {
      balance
    }
  }
`;
