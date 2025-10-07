import { createCachedProxyHandler } from './utils/cachedProxy';

export const handler = createCachedProxyHandler(
  () => 'https://api.coingecko.com/api/v3/global'
);
