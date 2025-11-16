import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Unemployment Rate (UNRATE)
// https://fred.stlouisfed.org/series/UNRATE
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'UNRATE';
  const limit = 1; // Latest value
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
