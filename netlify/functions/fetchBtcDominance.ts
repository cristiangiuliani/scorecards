import { createProxyHandler } from './utils/apiProxy';

export const handler = createProxyHandler(() => {
  return 'https://api.coingecko.com/api/v3/global';
});
