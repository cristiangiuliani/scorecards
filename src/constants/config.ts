export const GLOBALS = {
  defaultActiveTab: 0,
  ApiBaseUrl: '/scorecards/api',
  useMockData: false,
};

// no free api available for nasdaq pe ratio, hardcoding value
export const NASDAQ_PE_RATIO = {
  value: 39.51,
  lastUpdated: '31-10-2025',
  source: 'GuruFocus',
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
  score: 0.35, // Ridotto da 0.5 per scala ±10
};

export const STOCKS_WEIGHTS = {
  vix: 1.3,
  rsi: 1.0,
  eurUsd: 0.5,
  fearGreed: 1.2,
  athDistance: 1.8,
  momentum: 1.5,
  ma: 1.2,
  putCall: 0.8,
  treasury10Y: 1.0,
  score: 0.35, // Ridotto da 0.5 per scala ±10
};

export const STOCKS_SCOPE = {
  lookbackDays: 200,
};

export const CRYPTO_SCOPES = {
  lookbackDays: 120,
};
