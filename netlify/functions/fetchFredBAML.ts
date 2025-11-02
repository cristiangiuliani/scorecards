import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: ICE BofA US Corporate Index Option-Adjusted Spread (BAMLC0A0CM)
// https://fred.stlouisfed.org/series/BAMLC0A0CM
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'BAMLC0A0CM';
  const limit = 7; // Last 7 observations
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
