import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Using DGS10 (10-Year Treasury) as safe haven indicator
// Gold price data not reliably available via free FRED API
// Treasury yields serve similar purpose: rising yields = flight to safety
// https://fred.stlouisfed.org/series/DGS10
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'DGS10';
  const limit = 30; // Last 30 observations (daily data, ~1 month)
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
