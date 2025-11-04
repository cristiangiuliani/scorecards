import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Federal Reserve Total Assets (WALCL)
// https://fred.stlouisfed.org/series/WALCL
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'WALCL';
  const limit = 52; // Last 52 observations (weekly data, ~1 year)
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
