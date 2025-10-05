import { createProxyHandler } from './utils/apiProxy';

export const handler = createProxyHandler(() => {
  return 'https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX';
});
