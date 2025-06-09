// TypeScript types for GraphQL responses

// Common types
export interface Account {
  id: string;
  address: string;
  balance: string;
}

export interface Transfer {
  id: string;
  transaction: string; // This should always be present, not optional
  timestamp: string;
  block?: string;
  value: string;
  from: Account;
  to: Account;
}

export interface Meta {
  block: {
    number: string;
    hash: string;
  };
}

export interface Token {
  totalSupply: string;
  transferCount: string;
}

// Whale Alerts types
export interface WhaleAlertsResponse {
  transfers: Transfer[];
}

export interface MegaWhaleAlertsResponse {
  transfers: Transfer[];
}

export interface DashboardRefreshResponse {
  _meta: Meta;
  latestTransfers: {
    timestamp: string;
    value: string;
  }[];
  tokens: Token;
}

export interface ActivitySummaryResponse {
  last1h: { id: string }[];
  last24h: { id: string }[];
  whalesLast1h: {
    id: string;
    value: string;
  }[];
}

// Whale Leaderboard types
export interface WhaleLeaderboardResponse {
  accounts: {
    id: string;
    address: string;
    balance: string;
    transfersFrom: { timestamp: string }[];
    transfersTo: { timestamp: string }[];
  }[];
}

export interface WhaleActivityResponse {
  account: {
    address: string;
    balance: string;
    transfersFrom: {
      id: string;
      value: string;
      timestamp: string;
      to: {
        address: string;
      };
    }[];
    transfersTo: {
      id: string;
      value: string;
      timestamp: string;
      from: {
        address: string;
      };
    }[];
  };
}

export interface WhaleFlowAnalysisResponse {
  inflowTransfers: {
    value: string;
    timestamp: string;
    from: {
      address: string;
    };
  }[];
  outflowTransfers: {
    value: string;
    timestamp: string;
    to: {
      address: string;
    };
  }[];
}

export interface WhaleCounterpartiesResponse {
  transfersOut: {
    value: string;
    to: {
      address: string;
      balance: string;
    };
  }[];
  transfersIn: {
    value: string;
    from: {
      address: string;
      balance: string;
    };
  }[];
}

// Ocean Flow types
export interface MoneyFlowsResponse {
  transfers: Transfer[];
}

export interface AddressFlowResponse {
  transfers: {
    id: string;
    value: string;
    timestamp: string;
    from: {
      address: string;
    };
    to: {
      address: string;
    };
  }[];
}

export interface USDCVelocityResponse {
  transfers: {
    value: string;
    timestamp: string;
  }[];
  tokens: {
    totalSupply: string;
  };
}

export interface VolumeAnalysisResponse {
  transfers: {
    value: string;
    timestamp: string;
    block: string;
  }[];
}

export interface DistributionHealthResponse {
  accounts: {
    balance: string;
  }[];
}

// Time Machine types
export interface HistoricalActivityResponse {
  transfers: Transfer[];
}

export interface HourlyActivityResponse {
  transfers: {
    value: string;
    timestamp: string;
    from: {
      address: string;
    };
    to: {
      address: string;
    };
  }[];
}

export interface PaginatedTransfersResponse {
  transfers: {
    id: string;
    value: string;
    timestamp: string;
    from: {
      address: string;
    };
    to: {
      address: string;
    };
  }[];
}

export interface MobileWhaleFeedResponse {
  transfers: {
    id: string;
    value: string;
    timestamp: string;
    from: {
      address: string;
    };
    to: {
      address: string;
    };
  }[];
}