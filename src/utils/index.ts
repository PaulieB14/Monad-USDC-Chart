// Re-export all utilities from their respective modules

export {
  formatUSDCAmount,
  formatExactUSDCAmount,
  formatTimestamp,
  formatRelativeTime,
  getAmountColor,
  formatPercentChange,
  formatLargeNumber,
  formatActivityScore,
  formatBalance, // New smart balance formatter
} from './formatters';

export {
  shortenAddress,
  getAddressLabel,
} from './addressUtils';

export {
  playWhaleSound,
  playMegaWhaleSound,
} from './soundEffects';