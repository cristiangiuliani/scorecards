import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Federal Funds Effective Rate (FEDFUNDS)
// https://fred.stlouisfed.org/series/FEDFUNDS
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'FEDFUNDS';
  const limit = 1; // Latest value
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
