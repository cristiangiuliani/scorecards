import { createCachedProxyHandler } from './utils/cachedProxy';

export const handler = createCachedProxyHandler(
  () => {
    const apiKey = process.env.ALPHA_VANTAGE_KEY || '';
    return `https://www.alphavantage.co/query?function=RSI&symbol=SPY&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`;
  }
);
