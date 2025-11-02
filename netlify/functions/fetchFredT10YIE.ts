import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: 10-Year Breakeven Inflation Rate (T10YIE)
// https://fred.stlouisfed.org/series/T10YIE
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'T10YIE';
  const limit = 7; // Last 7 observations
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
