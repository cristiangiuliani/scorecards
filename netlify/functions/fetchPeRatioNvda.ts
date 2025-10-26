import { createCachedProxyHandler } from './utils/cachedProxy';

export const handler = createCachedProxyHandler(
  () => {
    const apiKey = process.env.FMP_API_KEY || '';
    return `https://financialmodelingprep.com/stable/ratios-ttm?symbol=NVDA&apikey=${apiKey}`;
  }
);
