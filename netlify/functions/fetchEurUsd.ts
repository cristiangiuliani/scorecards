import { createCachedProxyHandler } from './utils/cachedProxy';

// Fetch EUR/USD exchange rate from Yahoo Finance
// Symbol: EURUSD=X
export const handler = createCachedProxyHandler(
  () => {
    return 'https://query1.finance.yahoo.com/v8/finance/chart/EURUSD=X?interval=1d&range=1d';
  }
);
