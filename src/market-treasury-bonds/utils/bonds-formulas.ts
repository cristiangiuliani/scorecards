import { TREASURY_BONDS_WEIGHTS } from '../../constants/config';
import type { IBondsData } from '../../interfaces/market-treasury-bonds';

export const calculateYield10YScore = (value = 0): number => {
  if (value >= 5.0) return -4; // Very high rates - bearish for bonds
  if (value >= 4.5) return -3;
  if (value >= 4.0) return -2;
  if (value >= 3.5) return -1;
  if (value >= 3.0) return 0; // Neutral zone
  if (value >= 2.5) return 1;
  if (value >= 2.0) return 2;
  if (value >= 1.5) return 3; // Low rates - bullish for bonds
  return 4;
};

export const calculateYield5YScore = (value = 0): number => {
  if (value >= 4.8) return -4;
  if (value >= 4.3) return -3;
  if (value >= 3.8) return -2;
  if (value >= 3.3) return -1;
  if (value >= 2.8) return 0;
  if (value >= 2.3) return 1;
  if (value >= 1.8) return 2;
  if (value >= 1.3) return 3;
  return 4;
};

export const calculateYield2YScore = (value = 0): number => {
  if (value >= 4.5) return -4;
  if (value >= 4.0) return -3;
  if (value >= 3.5) return -2;
  if (value >= 3.0) return -1;
  if (value >= 2.5) return 0;
  if (value >= 2.0) return 1;
  if (value >= 1.5) return 2;
  if (value >= 1.0) return 3;
  return 4;
};

export const calculateYieldCurveSlopeScore = (value = 0): number => {
  // Positive slope (normal curve) is generally good
  // Negative slope (inverted curve) signals recession risk
  if (value <= -1.0) return -4; // Deeply inverted - very bearish
  if (value <= -0.5) return -3;
  if (value <= -0.2) return -2;
  if (value <= 0) return -1;
  if (value <= 0.3) return 0; // Flat curve
  if (value <= 0.6) return 1;
  if (value <= 1.0) return 2;
  if (value <= 1.5) return 3; // Steep curve - bullish
  return 4;
};

export const calculateCreditSpreadsScore = (value = 0): number => {
  // Credit spreads in basis points
  // Lower spreads = less risk = better for bonds
  if (value >= 400) return -4; // Very wide spreads - high risk
  if (value >= 300) return -3;
  if (value >= 200) return -2;
  if (value >= 150) return -1;
  if (value >= 120) return 0;
  if (value >= 100) return 1;
  if (value >= 80) return 2;
  if (value >= 60) return 3; // Tight spreads - low risk
  return 4;
};

export const calculateInflationScore = (value = 0): number => {
  // Inflation expectations in %
  // Lower inflation is better for bonds
  if (value >= 5.0) return -4; // High inflation - bad for bonds
  if (value >= 4.0) return -3;
  if (value >= 3.5) return -2;
  if (value >= 3.0) return -1;
  if (value >= 2.5) return 0; // Around Fed target
  if (value >= 2.0) return 1;
  if (value >= 1.5) return 2;
  if (value >= 1.0) return 3;
  return 4; // Low inflation - good for bonds
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
