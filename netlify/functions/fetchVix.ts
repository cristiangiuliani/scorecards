import { createCachedProxyHandler } from './utils/cachedProxy';

export const handler = createCachedProxyHandler((event) => {
  const interval = event.queryStringParameters?.interval;
  const range = event.queryStringParameters?.range;
  const options = interval && range ? `?interval=${interval}&range=${range}` : '';
  return `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX${options}`;
});
