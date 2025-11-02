import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: 2-Year Treasury Constant Maturity Rate (DGS2)
// https://fred.stlouisfed.org/series/DGS2
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'DGS2';
  const limit = 7; // Last 7 observations
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
