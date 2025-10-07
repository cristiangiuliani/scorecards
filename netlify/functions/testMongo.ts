import { createCachedProxyHandler } from './utils/cachedProxy';

export const handler = createCachedProxyHandler(
  () => 'https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX'
  // Override default TTL: { cacheTTL: 3600 }
  // Disable cache: { disableCache: true }
);
