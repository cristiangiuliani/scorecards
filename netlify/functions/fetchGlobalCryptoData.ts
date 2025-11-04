import { createCachedProxyHandler } from './utils/cachedProxy';

// CoinGecko API: Global Crypto Market Data
// Total market cap, volume, market cap percentage
export const handler = createCachedProxyHandler(
  () => 'https://api.coingecko.com/api/v3/global'
);
