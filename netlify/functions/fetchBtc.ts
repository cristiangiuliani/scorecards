import { createProxyHandler } from './utils/apiProxy';

export const handler = createProxyHandler(() => {
  return 'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false';
});
