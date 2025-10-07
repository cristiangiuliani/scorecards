import { createCachedProxyHandler } from './utils/cachedProxy';

export const handler = createCachedProxyHandler(
  (event) => {
    const days = event.queryStringParameters?.days || '200';
    return `https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?interval=1d&range=${days}d`;
  }
);
