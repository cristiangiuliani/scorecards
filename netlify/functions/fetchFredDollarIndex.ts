import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Trade Weighted U.S. Dollar Index: Broad, Goods and Services (DTWEXBGS)
// https://fred.stlouisfed.org/series/DTWEXBGS
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'DTWEXBGS';
  const limit = 30; // Last 30 observations (daily data, ~1 month)
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
