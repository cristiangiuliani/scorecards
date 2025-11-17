import { STOCKS_WEIGHTS } from '../../constants/config';
import type { IStocksData } from '../../interfaces/market-stocks';

export const calculateVixScore = (value = 0): number => {
  // VIX: low < 15 = calm (bullish), high > 30 = fear (bearish)
  if (value >= 40) return -4;
  if (value >= 30) return -3 - ((value - 30) / 10); // -3 to -4
  if (value >= 25) return -1 - ((value - 25) / 5) * 2; // -1 to -3
  if (value > 15) return (15 - value) / 10; // 0 to -1
  if (value >= 12) return 1 + ((15 - value) / 3); // 1 to 2
  return 2;
};

export const calculateRsiScore = (value = 0): number => {
  // RSI: overbought > 70, oversold < 30
  if (value >= 85) return 4;
  if (value >= 80) return 3 + ((value - 80) / 5); // 3 to 4
  if (value >= 70) return 2 + ((value - 70) / 10); // 2 to 3
  if (value >= 65) return 1 + ((value - 65) / 5); // 1 to 2
  if (value > 35) return 0;
  if (value >= 30) return -1 - ((35 - value) / 5); // 0 to -1
  if (value >= 20) return -2 - ((30 - value) / 10); // -1 to -2
  if (value >= 15) return -3 - ((20 - value) / 5); // -2 to -3
  return -4;
};

export const calculateEurUsdScore = (value = 0): number => {
  // Strong USD (EUR/USD low) = bullish for US stocks
  if (value <= 1.02) return 3;
  if (value <= 1.05) return 2 + ((1.05 - value) / 0.03); // 2 to 3
  if (value <= 1.08) return 1 + ((1.08 - value) / 0.03); // 1 to 2
  if (value < 1.15) return (1.15 - value) / 0.07; // 0 to 1
  if (value <= 1.20) return -1 - ((value - 1.15) / 0.05); // -1 to -2
  return -2;
};

export const calculateFearGreedScore = (value = 0): number => {
  // Extreme greed > 75 = bullish, Extreme fear < 25 = bearish
  if (value >= 85) return 4;
  if (value >= 75) return 3 + ((value - 75) / 10); // 3 to 4
  if (value >= 60) return 1 + ((value - 60) / 15) * 2; // 1 to 3
  if (value > 40) return (value - 40) / 20; // 0 to 1
  if (value >= 25) return -1 + ((value - 25) / 15); // -1 to 0
  if (value >= 15) return -3 + ((value - 15) / 10) * 2; // -3 to -1
  return -4;
};

export const calculateAthDistanceScore = (current: number, ath: number): number => {
  if (!current || !ath) return 0;

  const distance = (current / ath) * 100;

  // Very close to ATH = very bullish
  if (distance >= 98) return 4;
  if (distance >= 95) return 3 + ((distance - 95) / 3); // 3 to 4
  if (distance >= 90) return 2 + ((distance - 90) / 5); // 2 to 3
  if (distance >= 85) return 1 + ((distance - 85) / 5); // 1 to 2
  if (distance >= 80) return (distance - 80) / 5; // 0 to 1
  if (distance >= 75) return -1 + ((distance - 75) / 5); // -1 to 0
  if (distance >= 70) return -2 + ((distance - 70) / 5); // -2 to -1
  if (distance < 70) return -4 + ((distance - 50) / 20) * 2; // -4 to -2
  return 0;
};

export const calculateMomentum7dScore = (momentum7d: number): number => {
  // Momentum percentage for stocks (less volatile than crypto)
  if (momentum7d >= 5) return 2;
  if (momentum7d >= 2) return 1 + ((momentum7d - 2) / 3); // 1 to 2
  if (momentum7d > -2) return momentum7d / 2; // -1 to 1
  if (momentum7d >= -5) return -1 - ((-2 - momentum7d) / 3); // -1 to -2
  return -2;
};

export const calculateMomentumScore = (prices: number[]): number => {
  if (!prices || prices.length < 30) return 0;

  const current = prices[prices.length - 1];
  const day7ago = prices[prices.length - 8];
  const day30ago = prices[0];

  const momentum7d = ((current - day7ago) / day7ago) * 100;
  const momentum30d = ((current - day30ago) / day30ago) * 100;

  let score = 0;

  if (momentum7d > 5) score += 2;
  else if (momentum7d > 2) score += 1;
  else if (momentum7d < -5) score -= 2;
  else if (momentum7d < -2) score -= 1;

  if (momentum30d > 10) score += 2;
  else if (momentum30d > 5) score += 1;
  else if (momentum30d < -10) score -= 2;
  else if (momentum30d < -5) score -= 1;

  return score;
};

export const calculateMaScore = (prices: number[]): number => {
  if (!prices || prices.length < 200) return 0;

  const current = prices[prices.length - 1];
  const ma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / 50;
  const ma200 = prices.reduce((a, b) => a + b, 0) / 200;

  let score = 0;

  if (current > ma50 * 1.05) score += 2;
  else if (current > ma50) score += 1;
  else if (current < ma50 * 0.95) score -= 2;
  else if (current < ma50) score -= 1;

  if (ma50 > ma200 * 1.02) score += 2;
  else if (ma50 > ma200) score += 1;
  else if (ma50 < ma200 * 0.98) score -= 2;
  else if (ma50 < ma200) score -= 1;

  return score;
};

export const calculatePutCallScore = (ratio: number): number => {
  if (!ratio) return 0;

  if (ratio > 1.3) return 3;
  if (ratio > 1.1) return 2;
  if (ratio > 0.9) return 1;
  if (ratio < 0.5) return -3;
  if (ratio < 0.7) return -2;
  if (ratio < 0.8) return -1;
  return 0;
};

export const calculateTreasury10YScore = (yield10Y: number): number => {
  if (!yield10Y) return 0;

  if (yield10Y > 5.0) return -3;
  if (yield10Y > 4.5) return -2;
  if (yield10Y > 4.0) return -1;
  if (yield10Y < 2.5) return 2;
  if (yield10Y < 3.0) return 1;
  return 0;
};

export const calculateStocksScore = (data: IStocksData): number => {
  if (!data) return 0;

  const vixScore = data?.vix ? calculateVixScore(data.vix) : 0;
  const rsiScore = data?.rsiSP500 ? calculateRsiScore(data.rsiSP500) : 0;
  const eurUsdScore = data?.eurUsd ? calculateEurUsdScore(data.eurUsd) : 0;
  const fearGreedScore = data?.fearGreed ? calculateFearGreedScore(data.fearGreed) : 0;

  const athDistanceScore = data?.sp500Price && data?.sp500ATH
    ? calculateAthDistanceScore(data.sp500Price, data.sp500ATH) : 0;
  const momentumScore = data?.sp500Prices && data.sp500Prices.length >= 30
    ? calculateMomentumScore(data.sp500Prices) : 0;
  const maScore = data?.sp500Prices && data.sp500Prices.length >= 200
    ? calculateMaScore(data.sp500Prices) : 0;
  const putCallScore = data?.putCallRatio
    ? calculatePutCallScore(data.putCallRatio) : 0;
  const treasury10YScore = data?.treasury10Y
    ? calculateTreasury10YScore(data.treasury10Y) : 0;

  const weightedScore =
    (vixScore * STOCKS_WEIGHTS.vix) +
    (rsiScore * STOCKS_WEIGHTS.rsi) +
    (eurUsdScore * STOCKS_WEIGHTS.eurUsd) +
    (fearGreedScore * STOCKS_WEIGHTS.fearGreed) +
    (athDistanceScore * STOCKS_WEIGHTS.athDistance) +
    (momentumScore * STOCKS_WEIGHTS.momentum) +
    (maScore * STOCKS_WEIGHTS.ma) +
    (putCallScore * STOCKS_WEIGHTS.putCall) +
    (treasury10YScore * STOCKS_WEIGHTS.treasury10Y);

  return weightedScore * STOCKS_WEIGHTS.score;
};
