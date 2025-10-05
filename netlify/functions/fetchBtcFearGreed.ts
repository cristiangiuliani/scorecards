import { createProxyHandler } from './utils/apiProxy';

export const handler = createProxyHandler(() => {
  return 'https://api.alternative.me/fng/?limit=30';
});
