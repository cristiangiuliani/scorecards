import { createCachedProxyHandler } from './utils/cachedProxy';

export const handler = createCachedProxyHandler(
  () => 'https://api.alternative.me/fng/?limit=30'
);
