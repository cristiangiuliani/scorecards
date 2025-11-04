import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: M2 Money Supply (WM2NS)
// https://fred.stlouisfed.org/series/WM2NS
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'WM2NS';
  const limit = 52; // Last 52 observations (weekly data, ~1 year)
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
