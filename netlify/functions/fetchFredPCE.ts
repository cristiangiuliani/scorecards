import { createCachedProxyHandler } from './utils/cachedProxy';

// FRED API: Personal Consumption Expenditures Excluding Food and Energy (Core PCE)
// https://fred.stlouisfed.org/series/PCEPILFE
export const handler = createCachedProxyHandler(() => {
  const apiKey = process.env.FRED_API_KEY || 'YOUR_FRED_API_KEY';
  const seriesId = 'PCEPILFE';
  const limit = 13; // Last 13 months to calculate YoY
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
});
