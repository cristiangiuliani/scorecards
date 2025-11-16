import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Consumer Price Index for All Urban Consumers (CPIAUCSL)
// https://fred.stlouisfed.org/series/CPIAUCSL
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'CPIAUCSL';
  const limit = 13; // Last 13 months to calculate YoY
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
