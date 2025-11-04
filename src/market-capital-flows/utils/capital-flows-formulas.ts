import type { ICapitalFlowsData } from '../../interfaces/market-capital-flows';

// Fed Balance Sheet Growth Score
// Expanding balance sheet (QE) = positive for risk assets
// Contracting balance sheet (QT) = negative for risk assets
export const calculateFedBalanceSheetScore = (values: number[] = []): number => {
  if (values.length < 12) return 0; // Need at least 12 weeks of data

  const current = values[0];
  const weeks12Ago = values[11];
  const growthRate = ((current - weeks12Ago) / weeks12Ago) * 100;

  // Growth > 2% in 12 weeks = strong QE = very bullish
  if (growthRate > 2) return 4;
  // Growth > 1% = moderate QE = bullish
  if (growthRate > 1) return 3;
  // Growth > 0.5% = mild QE = slightly bullish
  if (growthRate > 0.5) return 2;
  // Growth > 0 = stable/slight growth = neutral/positive
  if (growthRate > 0) return 1;
  // Contraction < -0.5% = mild QT = slightly bearish
  if (growthRate < -0.5) return -2;
  // Contraction < -1% = moderate QT = bearish
  if (growthRate < -1) return -3;
  // Contraction < -2% = aggressive QT = very bearish
  if (growthRate < -2) return -4;
  return 0;
};

// M2 Money Supply Growth Score
// Growing M2 = more money in system = bullish
// Contracting M2 = less money = bearish
export const calculateM2MoneySupplyScore = (values: number[] = []): number => {
  if (values.length < 12) return 0;

  const current = values[0];
  const weeks12Ago = values[11];
  const growthRate = ((current - weeks12Ago) / weeks12Ago) * 100;

  // M2 growth > 3% in 12 weeks = strong liquidity = very bullish
  if (growthRate > 3) return 4;
  if (growthRate > 2) return 3;
  if (growthRate > 1) return 2;
  if (growthRate > 0) return 1;
  // M2 contraction = deflationary pressure = bearish
  if (growthRate < -1) return -2;
  if (growthRate < -2) return -3;
  if (growthRate < -3) return -4;
  return 0;
};

// Dollar Index Score
// Weak dollar = good for risk assets (crypto, stocks, commodities)
// Strong dollar = bad for risk assets (flight to safety)
export const calculateDollarIndexScore = (values: number[] = []): number => {
  if (values.length < 2) return 0;

  const current = values[0];
  const weekAgo = values[1];
  const change = ((current - weekAgo) / weekAgo) * 100;

  // Strong dollar weakening = bullish for risk
  if (current > 110 && change < -1) return 3;
  if (current > 105 && change < -0.5) return 2;
  // Dollar weakening = bullish
  if (change < -1) return 2;
  if (change < -0.5) return 1;
  // Dollar strengthening = bearish
  if (change > 1) return -2;
  if (change > 0.5) return -1;
  // Strong dollar strengthening = very bearish
  if (current > 110 && change > 1) return -3;
  if (current > 105 && change > 0.5) return -2;
  return 0;
};

// High Yield Spread Score
// Narrow spread = investors taking risk = bullish
// Wide spread = investors avoiding risk = bearish
export const calculateHighYieldSpreadScore = (value = 0): number => {
  if (!value) return 0;

  // Spread < 3% = very low risk premium = extreme greed = bullish
  if (value < 3) return 3;
  // Spread < 4% = low risk premium = risk-on = bullish
  if (value < 4) return 2;
  // Spread < 5% = moderate risk premium = neutral/positive
  if (value < 5) return 1;
  // Spread > 7% = high risk premium = risk-off = bearish
  if (value > 7) return -2;
  // Spread > 9% = very high risk premium = panic = very bearish
  if (value > 9) return -3;
  // Spread > 11% = extreme distress = crisis = extremely bearish
  if (value > 11) return -4;
  return 0;
};

// Treasury 10Y Yield Score (replaces Gold as safe haven indicator)
// Falling yields = flight to safety (bond buying) = bearish for risk assets
// Rising yields = risk-on (bond selling) = bullish for risk assets
export const calculateTreasury10YScore = (values: number[] = []): number => {
  if (values.length < 4) return 0;

  const current = values[0];
  const week4Ago = values[3];
  const change = current - week4Ago;

  // Yields rising significantly = money leaving bonds = bullish for risk
  if (change > 0.3) return 3;
  if (change > 0.2) return 2;
  if (change > 0.1) return 1;
  // Yields falling significantly = flight to safety = bearish for risk
  if (change < -0.3) return -3;
  if (change < -0.2) return -2;
  if (change < -0.1) return -1;
  return 0;
};

// Stablecoin Accumulation Score
// Growing stablecoin supply = dry powder ready to deploy = bullish
// Declining stablecoin supply = money leaving crypto = bearish
export const calculateStablecoinAccumulationScore = (
  current = 0,
  total = 0
): number => {
  if (!current || !total) return 0;

  // Calculate stablecoin dominance (% of total crypto market cap)
  const dominance = (current / total) * 100;

  // High stablecoin dominance = lots of dry powder = very bullish
  if (dominance > 8) return 4;
  if (dominance > 7) return 3;
  if (dominance > 6) return 2;
  if (dominance > 5) return 1;
  // Low stablecoin dominance = money already deployed = neutral/cautious
  if (dominance < 3) return -1;
  if (dominance < 2) return -2;
  return 0;
};

// Total Crypto Market Cap Growth Score
// Growing total market cap = capital inflows = bullish
// Declining total market cap = capital outflows = bearish
export const calculateCryptoMarketCapScore = (values: number[] = []): number => {
  if (values.length < 4) return 0;

  const current = values[0];
  const week4Ago = values[3];
  const change = ((current - week4Ago) / week4Ago) * 100;

  // Strong growth = capital inflows = bullish
  if (change > 15) return 4;
  if (change > 10) return 3;
  if (change > 5) return 2;
  if (change > 2) return 1;
  // Strong decline = capital outflows = bearish
  if (change < -15) return -4;
  if (change < -10) return -3;
  if (change < -5) return -2;
  if (change < -2) return -1;
  return 0;
};

// Calculate overall Capital Flows Score
export const calculateCapitalFlowsScore = (
  data: ICapitalFlowsData,
  fedBalanceSheetHistory: number[] = [],
  m2History: number[] = [],
  dollarIndexHistory: number[] = [],
  treasury10YHistory: number[] = [],
  cryptoMarketCapHistory: number[] = [],
  weights: {
    fedBalanceSheet: number;
    m2MoneySupply: number;
    dollarIndex: number;
    highYieldSpread: number;
    treasury10Y: number;
    stablecoinAccumulation: number;
    cryptoMarketCap: number;
    score: number;
  }
): number => {
  if (!data) return 0;

  const fedScore = calculateFedBalanceSheetScore(fedBalanceSheetHistory);
  const m2Score = calculateM2MoneySupplyScore(m2History);
  const dollarScore = calculateDollarIndexScore(dollarIndexHistory);
  const hySpreadScore = data?.highYieldSpread
    ? calculateHighYieldSpreadScore(data.highYieldSpread)
    : 0;
  const treasury10YScore = calculateTreasury10YScore(treasury10YHistory);
  const stablecoinScore =
    data?.stablecoinMarketCap && data?.totalCryptoMarketCap
      ? calculateStablecoinAccumulationScore(data.stablecoinMarketCap, data.totalCryptoMarketCap)
      : 0;
  const cryptoMcapScore = calculateCryptoMarketCapScore(cryptoMarketCapHistory);

  const weightedScore =
    fedScore * weights.fedBalanceSheet +
    m2Score * weights.m2MoneySupply +
    dollarScore * weights.dollarIndex +
    hySpreadScore * weights.highYieldSpread +
    treasury10YScore * weights.treasury10Y +
    stablecoinScore * weights.stablecoinAccumulation +
    cryptoMcapScore * weights.cryptoMarketCap;

  return weightedScore * weights.score;
};

// Helper: Calculate growth rate for display
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (!current || !previous) return 0;
  return ((current - previous) / previous) * 100;
};
