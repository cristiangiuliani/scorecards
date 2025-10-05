import { createProxyHandler } from './utils/apiProxy';

export const handler = createProxyHandler(() => {
  const apiKey = process.env.ALPHA_VANTAGE_KEY || '';
  return `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${apiKey}`;
});
