import { createProxyHandler } from './utils/apiProxy';

export const handler = createProxyHandler((event) => {
  const days = event.queryStringParameters?.days || '120';
  return `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`;
});
