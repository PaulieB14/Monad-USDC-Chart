// Configuration for the USDC Whale Commander dashboard

// The Graph API key from environment variables
export const GRAPH_API_KEY = process.env.REACT_APP_GRAPH_API_KEY || "YOUR_API_KEY";

// The Graph subgraph ID
export const SUBGRAPH_ID = "4KqDue5PfJ6qCyQG5pKWGjr1mkGxBS5c2nJ3Xfmw13fR";

// The Graph gateway URL
export const GRAPH_GATEWAY_URL = `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/${SUBGRAPH_ID}`;

// Threshold values for whale alerts (in USDC)
export const WHALE_THRESHOLDS = {
  SMALL: 50000, // $50K - Yellow
  MEDIUM: 250000, // $250K - Orange
  LARGE: 1000000, // $1M - Red (with sound effect)
};

// USDC has 6 decimal places
export const USDC_DECIMALS = 6;

// Convert from USDC token amount (with 6 decimals) to human-readable format
export const formatUSDC = (amount: string): number => {
  return parseFloat(amount) / Math.pow(10, USDC_DECIMALS);
};

// Convert from human-readable USDC amount to token amount with 6 decimals
export const toUSDCAmount = (amount: number): string => {
  return (amount * Math.pow(10, USDC_DECIMALS)).toString();
};

// Time calculations
export const getTimeAgo = (hours: number): string => {
  return Math.floor(Date.now() / 1000 - hours * 3600).toString();
};

export const ONE_HOUR_AGO = getTimeAgo(1);
export const SIX_HOURS_AGO = getTimeAgo(6);
export const ONE_DAY_AGO = getTimeAgo(24);
