import { createCachedProxyHandler } from './utils/cachedProxy';

// CoinGecko API: Stablecoin Market Data (USDT + USDC)
// Get market cap data for major stablecoins
export const handler = createCachedProxyHandler(
  () =>
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether,usd-coin&order=market_cap_desc&per_page=2&page=1&sparkline=false'
);
