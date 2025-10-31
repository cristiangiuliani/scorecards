import { STOCKS_WEIGHTS } from '../../constants/config';
import type { IStocksData } from '../../interfaces/market-stocks';

export const calculateVixScore = (value = 0): number => {
  if (value > 40) return -4;
  if (value > 30) return -3;
  if (value > 25) return -1;
  if (value < 12) return 2;
  if (value < 15) return 1;
  return 0;
};

export const calculateRsiScore = (value = 0): number => {
  if (value > 85) return -4;
  if (value > 80) return -3;
  if (value > 70) return -2;
  if (value > 65) return -1;
  if (value < 15) return 4;
  if (value < 20) return 3;
  if (value < 30) return 2;
  if (value < 35) return 1;
  return 0;
};

export const calculateEurUsdScore = (value = 0): number => {
  if (value < 1.02) return 3;
  if (value < 1.05) return 2;
  if (value < 1.08) return 1;
  if (value > 1.20) return -2;
  if (value > 1.15) return -1;
  return 0;
};

export const calculateFearGreedScore = (value = 0): number => {
  if (value < 15) return 4;
  if (value < 25) return 3;
  if (value < 40) return 1;
  if (value > 85) return -4;
  if (value > 75) return -3;
  if (value > 60) return -1;
  return 0;
};

export const calculateAthDistanceScore = (current: number, ath: number): number => {
  if (!current || !ath) return 0;

  const distance = (current / ath) * 100;

  if (distance > 99) return 3;
  if (distance > 95) return 2;
  if (distance > 90) return 1;
  if (distance < 70) return -3;
  if (distance < 80) return -2;
  if (distance < 85) return -1;
  return 0;
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
