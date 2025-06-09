// Configuration for the USDC Whale Commander dashboard

// The Graph API key from environment variables
export const GRAPH_API_KEY = process.env.REACT_APP_GRAPH_API_KEY || "";

// Your subgraph IPFS hash
export const SUBGRAPH_IPFS_HASH = "QmNbfA9NhEpDnYohsVDUJjgbHNNEAj9xYFYCnd4JrrhqV3";

// The Graph gateway URL - Updated to use your correct subgraph
export const GRAPH_GATEWAY_URL = GRAPH_API_KEY 
  ? `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/${SUBGRAPH_IPFS_HASH}`
  : `https://api.thegraph.com/subgraphs/id/${SUBGRAPH_IPFS_HASH}`;

// Fallback to public endpoint if no API key
export const SUBGRAPH_URL = `https://api.thegraph.com/subgraphs/id/${SUBGRAPH_IPFS_HASH}`;

// Threshold values for whale alerts (in USDC)
export const WHALE_THRESHOLDS = {
  SMALL: 50000, // $50K - Yellow
  MEDIUM: 250000, // $250K - Orange  
  LARGE: 1000000, // $1M - Red (with sound effect)
  MEGA: 10000000, // $10M - Critical alert
};

// USDC has 6 decimal places
export const USDC_DECIMALS = 6;

// Convert from USDC token amount (with 6 decimals) to human-readable format
export const formatUSDC = (amount: string): number => {
  return parseFloat(amount) / Math.pow(10, USDC_DECIMALS);
};

// Format USDC amount with proper units (K, M, B)
export const formatUSDCDisplay = (amount: string): string => {
  const num = formatUSDC(amount);
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

// Convert from human-readable USDC amount to token amount with 6 decimals
export const toUSDCAmount = (amount: number): string => {
  return (amount * Math.pow(10, USDC_DECIMALS)).toString();
};

// Time calculations
export const getTimeAgo = (hours: number): string => {
  return Math.floor(Date.now() / 1000 - hours * 3600).toString();
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Time constants
export const ONE_HOUR_AGO = () => getTimeAgo(1);
export const SIX_HOURS_AGO = () => getTimeAgo(6);
export const ONE_DAY_AGO = () => getTimeAgo(24);
export const ONE_WEEK_AGO = () => getTimeAgo(24 * 7);

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  WHALE_TRANSFERS: 15000,  // 15 seconds for large transfers
  GENERAL_DATA: 30000,     // 30 seconds for general data
  TOP_HOLDERS: 60000,      // 1 minute for holder rankings
};
