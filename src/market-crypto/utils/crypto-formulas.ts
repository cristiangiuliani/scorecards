import { CRYPTO_WEIGHTS } from '../../constants/config';
import type { ICryptoData } from '../../interfaces/market-crypto';

export const calculateBtcFearGreedScore = (value = 0):number => {
  // Range: 0-100, Extreme Fear < 25, Fear < 45, Greed > 55, Extreme Greed > 75
  if (value >= 90) return 4;
  if (value >= 75) return 3 + ((value - 75) / 15); // 3 to 4
  if (value >= 55) return 1 + ((value - 55) / 20) * 2; // 1 to 3
  if (value >= 45) return (value - 45) / 10; // 0 to 1
  if (value >= 25) return -1 + ((value - 25) / 20); // -1 to 0
  if (value >= 10) return -3 + ((value - 10) / 15) * 2; // -3 to -1
  return -4;
};
export const calculateBtcRsiScore = (value = 0):number => {
  // Overbought zones: 65-70-80-85+, Oversold zones: 35-30-20-15-
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
export const calculateBtcDominanceScore = (value = 0):number => {
  // High dominance (>60) = BTC strength, Low dominance (<40) = Alt strength
  if (value >= 65) return 2;
  if (value >= 60) return 1 + ((value - 60) / 5); // 1 to 2
  if (value > 40) return (value - 40) / 20; // 0 to 1
  if (value >= 35) return -1 + ((value - 35) / 5); // -1 to 0
  return -2;
};
export const calculateAltSeasonScore = (value = 0):number => {
  // Altseason index: low = BTC dominance (good), high = altseason (risky)
  if (value >= 80) return -2;
  if (value >= 60) return -1 - ((value - 60) / 20); // -1 to -2
  if (value > 40) return -((value - 40) / 20); // 0 to -1
  if (value >= 20) return 1 - ((value - 20) / 20); // 1 to 0
  return 2;
};

export const calculateAthDistanceScore = (current: number | undefined, ath: number | undefined): number => {
  if (!current || !ath) return 0;

  const distance = (current / ath) * 100;

  // Very close to ATH (98%+) = max bullish, far from ATH (<50%) = max bearish
  if (distance >= 98) return 4;
  if (distance >= 95) return 3 + ((distance - 95) / 3); // 3 to 4
  if (distance >= 90) return 2 + ((distance - 90) / 5); // 2 to 3
  if (distance >= 85) return 1 + ((distance - 85) / 5); // 1 to 2
  if (distance >= 80) return (distance - 80) / 5; // 0 to 1
  if (distance >= 70) return -1 + ((distance - 70) / 10); // -1 to 0
  if (distance >= 60) return -2 + ((distance - 60) / 10); // -2 to -1
  if (distance >= 50) return -3 + ((distance - 50) / 10); // -3 to -2
  return -4;
};

export const calculateMomentum7dScore = (momentum7d: number): number => {
  // Momentum percentage: >15% very bullish, <-15% very bearish
  if (momentum7d >= 15) return 4;
  if (momentum7d >= 10) return 3 + ((momentum7d - 10) / 5); // 3 to 4
  if (momentum7d >= 5) return 2 + ((momentum7d - 5) / 5); // 2 to 3
  if (momentum7d >= 2) return 1 + ((momentum7d - 2) / 3); // 1 to 2
  if (momentum7d > -2) return momentum7d / 2; // -1 to 1
  if (momentum7d >= -5) return -1 - ((-2 - momentum7d) / 3); // -1 to -2
  if (momentum7d >= -10) return -2 - ((-5 - momentum7d) / 5); // -2 to -3
  if (momentum7d >= -15) return -3 - ((-10 - momentum7d) / 5); // -3 to -4
  return -4;
};

export const calculateMomentumScore = (prices: number[]): number => {
  if (!prices || prices.length < 30) return 0;

  const current = prices[prices.length - 1];
  const day7ago = prices[prices.length - 8];
  const day30ago = prices[0];

  const momentum7d = ((current - day7ago) / day7ago) * 100;
  const momentum30d = ((current - day30ago) / day30ago) * 100;

  let score = 0;

  if (momentum7d > 15) score += 4;
  else if (momentum7d > 10) score += 3;
  else if (momentum7d > 5) score += 2;
  else if (momentum7d > 2) score += 1;
  else if (momentum7d < -15) score -= 4;
  else if (momentum7d < -10) score -= 3;
  else if (momentum7d < -5) score -= 2;
  else if (momentum7d < -2) score -= 1;

  if (momentum30d > 30) score += 3;
  else if (momentum30d > 20) score += 2;
  else if (momentum30d > 10) score += 1;
  else if (momentum30d < -30) score -= 3;
  else if (momentum30d < -20) score -= 2;
  else if (momentum30d < -10) score -= 1;

  return score;
};

export const calculateMaScore = (prices: number[]): number => {
  if (!prices || prices.length < 200) return 0;

  const current = prices[prices.length - 1];

  const ma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / 50;
  const ma200 = prices.reduce((a, b) => a + b, 0) / 200;

  let score = 0;

  if (current > ma50 * 1.1) score += 2;
  else if (current > ma50) score += 1;
  else if (current < ma50 * 0.9) score -= 2;
  else if (current < ma50) score -= 1;

  if (ma50 > ma200 * 1.05) score += 2;
  else if (ma50 > ma200) score += 1;
  else if (ma50 < ma200 * 0.95) score -= 2;
  else if (ma50 < ma200) score -= 1;

  return score;
};

export const calculateVolumeScore = (volumes: number[]): number => {
  if (!volumes || volumes.length < 7) return 0;

  const recentVol = volumes.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const avgVol = volumes.reduce((a, b) => a + b, 0) / volumes.length;

  const ratio = recentVol / avgVol;

  if (ratio > 1.5) return 2;
  if (ratio > 1.2) return 1;
  if (ratio < 0.5) return -2;
  if (ratio < 0.8) return -1;
  return 0;
};

export const calculateAthDistance = (currentPrice:number | undefined, ath:number | undefined) => {
  return currentPrice && ath ? (currentPrice / ath) * 100 : 0;
};
export const calculateMomentum7d = (prices: number[] | undefined = []) => {
  return prices.length >= 8 ?
    ((prices[prices.length - 1] - prices[prices.length - 8]) / prices[prices.length - 8]) * 100
    : 0;
};

export const calculateAltcoinSeasonIndex = (btcDominance:number | undefined = 0) => {
  return Math.max(0, Math.min(100,
    ((70 - btcDominance) / 30) * 100
  ));
};

export const calculateCryptoScore = (data:ICryptoData, btcRsi:number, altcoinSeasonIndex:number):number => {
  if (!data) return 0;
  const btcFearScore = data?.btcFearGreed ? calculateBtcFearGreedScore(data.btcFearGreed) : 0;
  const btcRsiScore = btcRsi ? calculateBtcRsiScore(btcRsi) : 0;
  const btcDomScore = data?.btcDominance ? calculateBtcDominanceScore(data.btcDominance) : 0;
  const altSeasonScore = altcoinSeasonIndex ? calculateAltSeasonScore(altcoinSeasonIndex) : 0;

  const athDistanceScore = data?.currentPrice && data?.ath
    ? calculateAthDistanceScore(data.currentPrice, data.ath) : 0;
  const momentumScore = data?.prices && data.prices.length >= 30
    ? calculateMomentumScore(data.prices) : 0;
  const maScore = data?.prices && data.prices.length >= 200
    ? calculateMaScore(data.prices) : 0;
  const volumeScore = data?.volumes && data.volumes.length >= 7
    ? calculateVolumeScore(data.volumes) : 0;

  const weightedScore =
    (btcFearScore * CRYPTO_WEIGHTS.fearGreed) +
    (btcRsiScore * CRYPTO_WEIGHTS.rsi) +
    (btcDomScore * CRYPTO_WEIGHTS.dominance) +
    (altSeasonScore * CRYPTO_WEIGHTS.altcoinSeason) +
    (athDistanceScore * CRYPTO_WEIGHTS.athDistance) +
    (momentumScore * CRYPTO_WEIGHTS.momentum) +
    (maScore * CRYPTO_WEIGHTS.ma) +
    (volumeScore * CRYPTO_WEIGHTS.volume);
  return weightedScore * CRYPTO_WEIGHTS.score;
};
