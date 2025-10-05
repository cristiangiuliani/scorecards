export const GLOBALS = {
  defaultActiveTab: 0,
  dataRefreshInterval: 15 * 60 * 1000, // 15 minutes
  maxDataPoints: 365, // Max data points to fetch for charts
  movingAveragePeriod: 50, // Period for moving average calculation
  ApiBaseUrl: '/scorecards/api',
};
export const CRYPTO_WEIGHTS = {
  fearGreed: 1.2,
  rsi: 1.0,
  dominance: 0.8,
  altcoinSeason: 0.6,
  athDistance: 1.8,
  momentum: 1.5,
  ma: 1.2,
  volume: 0.9,
  score: 0.5,
};
