import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: 10-Year Treasury Constant Maturity Rate (DGS10)
// https://fred.stlouisfed.org/series/DGS10
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'DGS10';
  const limit = 7; // Last 7 observations
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
