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

// Monad blockchain explorer URLs - Fixed URL format for MonadExplorer
export const MONAD_EXPLORER = {
  BASE_URL: 'https://testnet.monadexplorer.com',
  TRANSACTION: (hash: string) => `${MONAD_EXPLORER.BASE_URL}/tx/${hash}`,
  ADDRESS: (address: string) => `${MONAD_EXPLORER.BASE_URL}/address/${address}`, // Fixed: use /address/ not /account/
  TOKEN: (address: string) => `${MONAD_EXPLORER.BASE_URL}/token/${address}`,
};

// Alternative explorers for fallback
export const ALTERNATIVE_EXPLORERS = {
  MONADSCAN: {
    BASE_URL: 'https://testnet.monadscan.com',
    TRANSACTION: (hash: string) => `https://testnet.monadscan.com/tx/${hash}`,
    ADDRESS: (address: string) => `https://testnet.monadscan.com/address/${address}`,
    TOKEN: (address: string) => `https://testnet.monadscan.com/token/${address}`,
  },
  SOCIALSCAN: {
    BASE_URL: 'https://monad-testnet.socialscan.io',
    TRANSACTION: (hash: string) => `https://monad-testnet.socialscan.io/tx/${hash}`,
    ADDRESS: (address: string) => `https://monad-testnet.socialscan.io/address/${address}`,
    TOKEN: (address: string) => `https://monad-testnet.socialscan.io/token/${address}`,
  }
};

// Threshold values for whale alerts (in USDC)
export const WHALE_THRESHOLDS = {
  SMALL: 50000, // $50K - Yellow
  MEDIUM: 250000, // $250K - Orange  
  LARGE: 1000000, // $1M - Red (with sound effect)
  MEGA: 10000000, // $10M - Critical alert
};

// USDC has 6 decimal places, but subgraph appears to store balances with 18 decimals
export const USDC_DECIMALS = 6;
export const SUBGRAPH_BALANCE_DECIMALS = 18; // The subgraph is actually using 18 decimals for balances

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

// Format large numbers for display (without dollar sign)
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toLocaleString();
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

// Polling intervals (in milliseconds) - DISABLED by default to save queries
export const POLLING_INTERVALS = {
  WHALE_TRANSFERS: 0,  // Disabled - manual refresh only
  GENERAL_DATA: 0,     // Disabled - manual refresh only  
  TOP_HOLDERS: 0,      // Disabled - manual refresh only
};

// Manual refresh settings
export const REFRESH_SETTINGS = {
  ENABLED: true,
  SHOW_LAST_UPDATED: true,
  AUTO_REFRESH_DISABLED_MESSAGE: "Auto-refresh disabled to save API queries. Click refresh to update data."
};

// Blockchain info
export const BLOCKCHAIN_INFO = {
  NAME: 'Monad Testnet',
  SYMBOL: 'MON',
  EXPLORER_NAME: 'MonadExplorer',
  EXPLORER_URL: MONAD_EXPLORER.BASE_URL,
};