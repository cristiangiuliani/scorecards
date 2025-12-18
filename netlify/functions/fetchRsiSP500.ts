import { createCachedProxyHandler } from './utils/cachedProxy';

// Fetch S&P500 price data from Yahoo Finance for RSI calculation
// RSI will be calculated client-side like BTC RSI
export const handler = createCachedProxyHandler(
  (event) => {
    // Need at least 14 days + buffer for RSI calculation
    const days = event.queryStringParameters?.days || '30';
    return `https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?interval=1d&range=${days}d`;
  }
);
