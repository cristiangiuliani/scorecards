import { TREASURY_BONDS_WEIGHTS } from '../../constants/config';
import type { IBondsData } from '../../interfaces/market-treasury-bonds';

export const calculateYield10YScore = (value = 0): number => {
  // 10Y Yield: lower rates = better for bonds
  if (value >= 5.0) return -4;
  if (value >= 4.5) return -3 - ((value - 4.5) / 0.5); // -3 to -4
  if (value >= 4.0) return -2 - ((value - 4.0) / 0.5); // -2 to -3
  if (value >= 3.5) return -1 - ((value - 3.5) / 0.5); // -1 to -2
  if (value >= 3.0) return ((3.5 - value) / 0.5) - 1; // 0 to -1
  if (value >= 2.5) return 1 - ((3.0 - value) / 0.5); // 1 to 0
  if (value >= 2.0) return 2 - ((2.5 - value) / 0.5); // 2 to 1
  if (value >= 1.5) return 3 - ((2.0 - value) / 0.5); // 3 to 2
  if (value < 1.5) return 4 - Math.min(1, (1.5 - value) / 0.5); // 3 to 4
  return 4;
};

export const calculateYield5YScore = (value = 0): number => {
  // 5Y Yield: lower rates = better for bonds
  if (value >= 4.8) return -4;
  if (value >= 4.3) return -3 - ((value - 4.3) / 0.5); // -3 to -4
  if (value >= 3.8) return -2 - ((value - 3.8) / 0.5); // -2 to -3
  if (value >= 3.3) return -1 - ((value - 3.3) / 0.5); // -1 to -2
  if (value >= 2.8) return ((3.3 - value) / 0.5) - 1; // 0 to -1
  if (value >= 2.3) return 1 - ((2.8 - value) / 0.5); // 1 to 0
  if (value >= 1.8) return 2 - ((2.3 - value) / 0.5); // 2 to 1
  if (value >= 1.3) return 3 - ((1.8 - value) / 0.5); // 3 to 2
  if (value < 1.3) return 4 - Math.min(1, (1.3 - value) / 0.5); // 3 to 4
  return 4;
};

export const calculateYield2YScore = (value = 0): number => {
  // 2Y Yield: lower rates = better for bonds
  if (value >= 4.5) return -4;
  if (value >= 4.0) return -3 - ((value - 4.0) / 0.5); // -3 to -4
  if (value >= 3.5) return -2 - ((value - 3.5) / 0.5); // -2 to -3
  if (value >= 3.0) return -1 - ((value - 3.0) / 0.5); // -1 to -2
  if (value >= 2.5) return ((3.0 - value) / 0.5) - 1; // 0 to -1
  if (value >= 2.0) return 1 - ((2.5 - value) / 0.5); // 1 to 0
  if (value >= 1.5) return 2 - ((2.0 - value) / 0.5); // 2 to 1
  if (value >= 1.0) return 3 - ((1.5 - value) / 0.5); // 3 to 2
  if (value < 1.0) return 4 - Math.min(1, (1.0 - value) / 0.5); // 3 to 4
  return 4;
};

export const calculateYieldCurveSlopeScore = (value = 0): number => {
  // Positive slope (normal curve) is good, negative (inverted) is bad
  if (value >= 1.5) return 4;
  if (value >= 1.0) return 3 + ((value - 1.0) / 0.5); // 3 to 4
  if (value >= 0.6) return 2 + ((value - 0.6) / 0.4); // 2 to 3
  if (value >= 0.3) return 1 + ((value - 0.3) / 0.3); // 1 to 2
  if (value > 0) return value / 0.3; // 0 to 1
  if (value >= -0.2) return value / 0.2; // 0 to -1
  if (value >= -0.5) return -1 - ((value + 0.2) / 0.3); // -1 to -2
  if (value >= -1.0) return -2 - ((value + 0.5) / 0.5); // -2 to -3
  return -4;
};

export const calculateCreditSpreadsScore = (value = 0): number => {
  // Credit spreads in basis points - lower = better
  if (value >= 400) return -4;
  if (value >= 300) return -3 - ((value - 300) / 100); // -3 to -4
  if (value >= 250) return -2 - ((value - 250) / 50); // -2 to -3
  if (value >= 200) return -1 - ((value - 200) / 50); // -1 to -2
  if (value > 160) return ((200 - value) / 40) - 1; // 0 to -1
  if (value >= 130) return 1 - ((160 - value) / 30); // 1 to 0
  if (value >= 100) return 2 - ((130 - value) / 30); // 2 to 1
  if (value >= 80) return 3 - ((100 - value) / 20); // 3 to 2
  if (value < 80) return 4 - Math.min(1, (80 - value) / 20); // 3 to 4
  return 4;
};

export const calculateInflationScore = (value = 0): number => {
  // Inflation expectations - lower = better for bonds
  if (value >= 5.0) return -4;
  if (value >= 4.0) return -3 - ((value - 4.0) / 1.0); // -3 to -4
  if (value >= 3.5) return -2 - ((value - 3.5) / 0.5); // -2 to -3
  if (value >= 3.0) return -1 - ((value - 3.0) / 0.5); // -1 to -2
  if (value >= 2.5) return ((3.0 - value) / 0.5) - 1; // 0 to -1
  if (value >= 2.0) return 1 - ((2.5 - value) / 0.5); // 1 to 0
  if (value >= 1.5) return 2 - ((2.0 - value) / 0.5); // 2 to 1
  if (value >= 1.0) return 3 - ((1.5 - value) / 0.5); // 3 to 2
  if (value < 1.0) return 4 - Math.min(1, (1.0 - value) / 0.5); // 3 to 4
  return 4;
};

export const calculateBondsScore = (data: IBondsData): number => {
  const yield10YScore = data?.yield10Y !== undefined ? calculateYield10YScore(data.yield10Y) : 0;
  const yield5YScore = data?.yield5Y !== undefined ? calculateYield5YScore(data.yield5Y) : 0;
  const yield2YScore = data?.yield2Y !== undefined ? calculateYield2YScore(data.yield2Y) : 0;
  const yieldCurveSlopeScore =
    data?.yieldCurveSlope !== undefined ? calculateYieldCurveSlopeScore(data.yieldCurveSlope) : 0;
  const creditSpreadsScore =
    data?.creditSpreads !== undefined ? calculateCreditSpreadsScore(data.creditSpreads) : 0;
  const inflationScore =
    data?.inflationExpectations !== undefined
      ? calculateInflationScore(data.inflationExpectations)
      : 0;

  const weightedScore =
    yield10YScore * TREASURY_BONDS_WEIGHTS.yield10Y +
    yield5YScore * TREASURY_BONDS_WEIGHTS.yield5Y +
    yield2YScore * TREASURY_BONDS_WEIGHTS.yield2Y +
    yieldCurveSlopeScore * TREASURY_BONDS_WEIGHTS.yieldCurveSlope +
    creditSpreadsScore * TREASURY_BONDS_WEIGHTS.creditSpreads +
    inflationScore * TREASURY_BONDS_WEIGHTS.inflation;

  return weightedScore * TREASURY_BONDS_WEIGHTS.score;
};
