import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Average Hourly Earnings of All Employees (CES0500000003)
// https://fred.stlouisfed.org/series/CES0500000003
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'CES0500000003';
  const limit = 13; // Last 13 months to calculate YoY
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
