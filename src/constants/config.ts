export const GLOBALS = {
  defaultActiveTab: 0,
  ApiBaseUrl: '/scorecards/api',
  useMockData: false,
};

// no free api available for nasdaq pe ratio, hardcoding value
export const NASDAQ_PE_RATIO = {
  value: 37.24,
  lastUpdated: '11-11-2025',
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
  score: 0.35,
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
  score: 0.35,
};

export const STOCKS_SCOPE = {
  lookbackDays: 200,
};

export const CRYPTO_SCOPES = {
  lookbackDays: 120,
};

export const STOCKS_RANGES = {
  vix: {
    min: 0,
    max: 80,
    minLabel: 'Low',
    maxLabel: 'High',
  },
  rsi: {
    min: 0,
    max: 100,
    minLabel: 'Overbought',
    maxLabel: 'Oversold',
  },
  eurUsd: {
    min: 0.90,
    max: 1.30,
    minLabel: 'Weak €',
    maxLabel: 'Strong €',
  },
  fearGreed: {
    min: 0,
    max: 100,
    minLabel: 'Fear',
    maxLabel: 'Greed',
  },
  athDistance: {
    min: 70,
    max: 100,
    minLabel: 'Low',
    maxLabel: 'ATH',
  },
  momentum: {
    min: -10,
    max: 10,
    minLabel: 'Down',
    maxLabel: 'Up',
  },
  putCall: {
    min: 0.5,
    max: 1.5,
    minLabel: 'Bullish',
    maxLabel: 'Bearish',
  },
  treasury10Y: {
    min: 0,
    max: 8,
    minLabel: 'Low',
    maxLabel: 'High',
  },
};

export const CRYPTO_RANGES = {
  fearGreed: {
    min: 0,
    max: 100,
    minLabel: 'Fear',
    maxLabel: 'Greed',
  },
  rsi: {
    min: 0,
    max: 100,
    minLabel: 'Overbought',
    maxLabel: 'Oversold',
  },
  dominance: {
    min: 40,
    max: 70,
    minLabel: 'Altcoins',
    maxLabel: 'BTC',
  },
  altcoinSeason: {
    min: 0,
    max: 100,
    minLabel: 'BTC Season',
    maxLabel: 'Alt Season',
  },
  athDistance: {
    min: 50,
    max: 100,
    minLabel: 'Low',
    maxLabel: 'ATH',
  },
  momentum: {
    min: -15,
    max: 15,
    minLabel: 'Down',
    maxLabel: 'Up',
  },
};

export const BUBBLE_RANGES = {
  nvidiaPE: {
    min: 0,
    max: 100,
    minLabel: 'Low',
    maxLabel: 'Bubble',
  },
  nasdaqPE: {
    min: 0,
    max: 50,
    minLabel: 'Low',
    maxLabel: 'Bubble',
  },
  nvdaNasdaqRatio: {
    min: 0,
    max: 3,
    minLabel: 'Low',
    maxLabel: 'High',
  },
  vixPersistence: {
    min: 0,
    max: 5,
    minLabel: 'Calm',
    maxLabel: 'Fear',
  },
  fearGreed: {
    min: 0,
    max: 100,
    minLabel: 'Fear',
    maxLabel: 'Greed',
  },
  rsi: {
    min: 0,
    max: 100,
    minLabel: 'Overbought',
    maxLabel: 'Oversold',
  },
};

export const TREASURY_BONDS_WEIGHTS = {
  yield10Y: 1.5,
  yield5Y: 1.2,
  yield2Y: 1.0,
  yieldCurveSlope: 1.8,
  creditSpreads: 1.3,
  inflation: 1.4,
  score: 0.35,
};

export const TREASURY_BONDS_RANGES = {
  yield10Y: {
    min: 0,
    max: 8,
    minLabel: 'Low',
    maxLabel: 'High',
  },
  yield5Y: {
    min: 0,
    max: 7,
    minLabel: 'Low',
    maxLabel: 'High',
  },
  yield2Y: {
    min: 0,
    max: 6,
    minLabel: 'Low',
    maxLabel: 'High',
  },
  yieldCurveSlope: {
    min: -2,
    max: 3,
    minLabel: 'Inverted',
    maxLabel: 'Steep',
  },
  creditSpreads: {
    min: 0,
    max: 600,
    minLabel: 'Tight',
    maxLabel: 'Wide',
  },
  inflation: {
    min: 0,
    max: 6,
    minLabel: 'Low',
    maxLabel: 'High',
  },
};

export const CAPITAL_FLOWS_WEIGHTS = {
  fedBalanceSheet: 1.5,
  m2MoneySupply: 1.3,
  dollarIndex: 1.1,
  highYieldSpread: 1.2,
  treasury10Y: 1.0,
  stablecoinAccumulation: 1.4,
  cryptoMarketCap: 1.2,
  score: 0.35, // Scale to ±10 range
};

export const CAPITAL_FLOWS_RANGES = {
  fedBalanceSheetGrowth: {
    min: -3,
    max: 3,
    minLabel: 'QT',
    maxLabel: 'QE',
  },
  m2Growth: {
    min: -3,
    max: 3,
    minLabel: 'Contracting',
    maxLabel: 'Expanding',
  },
  dollarIndex: {
    min: 80,
    max: 140,
    minLabel: 'Weak',
    maxLabel: 'Strong',
  },
  highYieldSpread: {
    min: 0,
    max: 15,
    minLabel: 'Risk-On',
    maxLabel: 'Risk-Off',
  },
  treasury10YChange: {
    min: -0.5,
    max: 0.5,
    minLabel: 'Falling',
    maxLabel: 'Rising',
  },
  stablecoinDominance: {
    min: 0,
    max: 10,
    minLabel: 'Deployed',
    maxLabel: 'Dry Powder',
  },
  cryptoMcapGrowth: {
    min: -20,
    max: 20,
    minLabel: 'Outflows',
    maxLabel: 'Inflows',
  },
};
