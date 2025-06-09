// Utility functions for working with Ethereum addresses

// Known address labels
interface AddressLabels {
  [address: string]: string;
}

// Some example known addresses (in a real app, this would be a more comprehensive list)
export const KNOWN_ADDRESSES: AddressLabels = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC Contract',
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap Router',
  '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be': 'Binance',
  '0x28c6c06298d514db089934071355e5743bf21d60': 'Binance 2',
  '0xdfd5293d8e347dfe59e90efd55b2956a1343963d': 'Binance 3',
  '0x21a31ee1afc51d94c2efccaa2092ad1028285549': 'Binance Cold Wallet',
  '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8': 'Binance Cold Wallet 2',
  '0x5041ed759dd4afc3a72b8192c143f72f4724081a': 'Coinbase',
  '0x71660c4005ba85c37ccec55d0c4493e66fe775d3': 'Coinbase 2',
  '0xa910f92acdaf488fa6ef02174fb86208ad7722ba': 'Kraken',
  '0x2b5634c42055806a59e9107ed44d43c426e58258': 'Kucoin',
  '0x0d0707963952f2fba59dd06f2b425ace40b492fe': 'Gate.io',
  '0x1111111254fb6c44bac0bed2854e76f90643097d': '1inch Router',
  '0x881d40237659c251811cec9c364ef91dc08d300c': 'Metamask Swap Router',
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': '0x Exchange',
};

// Shorten address for display
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Get label for an address
export const getAddressLabel = (address: string): string => {
  if (!address) return 'Unknown';
  
  // Check if it's a known address
  const label = KNOWN_ADDRESSES[address.toLowerCase()];
  if (label) return label;
  
  // Check for patterns that might indicate the type of address
  if (address.startsWith('0x0000000000000')) return 'Burn Address';
  
  // Return 'Address' instead of 'Unknown Whale'
  return 'Address';
};

// Determine if an address is likely an exchange
export const isExchange = (address: string): boolean => {
  if (!address) return false;
  
  const label = KNOWN_ADDRESSES[address.toLowerCase()];
  if (!label) return false;
  
  return label.includes('Binance') || 
         label.includes('Coinbase') || 
         label.includes('Kraken') || 
         label.includes('Kucoin') || 
         label.includes('Gate.io');
};

// Determine if an address is likely a DEX
export const isDEX = (address: string): boolean => {
  if (!address) return false;
  
  const label = KNOWN_ADDRESSES[address.toLowerCase()];
  if (!label) return false;
  
  return label.includes('Uniswap') || 
         label.includes('1inch') || 
         label.includes('0x') || 
         label.includes('Swap');
};

// Get a color for an address (for visualization)
export const getAddressColor = (address: string): string => {
  if (!address) return '#cccccc';
  
  // Generate a deterministic color based on the address
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};
