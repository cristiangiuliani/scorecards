import { CRYPTO_WEIGHTS } from '../../constants/config';
import type { ICryptoData } from '../../interfaces/market-crypto';

export const calculateBtcFearGreedScore = (value = 0):number => {
  if (value < 10) return -4;
  if (value < 25) return -3;
  if (value < 45) return -1;
  if (value > 90) return 4;
  if (value > 75) return 3;
  if (value > 55) return 1;
  return 0;
};
export const calculateBtcRsiScore = (value = 0):number => {
  if (value > 85) return 4;
  if (value > 80) return 3;
  if (value < 15) return -4;
  if (value < 20) return -3;
  if (value < 30) return -2;
  if (value < 35) return -1;
  if (value > 75) return 2;
  if (value > 70) return 1;
  return 0;
};
export const calculateBtcDominanceScore = (value = 0):number => {
  if (value < 35) return -2;
  if (value < 40) return -1;
  if (value > 65) return 2;
  if (value > 60) return 1;
  return 0;
};
export const calculateAltSeasonScore = (value = 0):number => {
  if (value > 80) return -2;
  if (value > 60) return -1;
  if (value < 20) return 2;
  if (value < 40) return 1;
  return 0;
};

export const calculateAthDistanceScore = (current: number | undefined, ath: number | undefined): number => {
  if (!current || !ath) return 0;

  const distance = (current / ath) * 100;

  if (distance > 98) return 3;
  if (distance > 90) return 2;
  if (distance > 80) return 1;
  if (distance < 40) return -3;
  if (distance < 50) return -2;
  if (distance < 60) return -1;
  return 0;
};

export const calculateMomentum7dScore = (momentum7d: number): number => {
  let score = 0;

  if (momentum7d > 15) score = 3;
  else if (momentum7d > 10) score = 2;
  else if (momentum7d > 5) score = 1;
  else if (momentum7d < -15) score = -3;
  else if (momentum7d < -10) score = -2;
  else if (momentum7d < -5) score = -1;

  return score;
};

export const calculateMomentumScore = (prices: number[]): number => {
  if (!prices || prices.length < 30) return 0;

  const current = prices[prices.length - 1];
  const day7ago = prices[prices.length - 8];
  const day30ago = prices[0];

  const momentum7d = ((current - day7ago) / day7ago) * 100;
  const momentum30d = ((current - day30ago) / day30ago) * 100;

  let score = 0;

  if (momentum7d > 15) score += 3;
  else if (momentum7d > 10) score += 2;
  else if (momentum7d > 5) score += 1;
  else if (momentum7d < -15) score -= 3;
  else if (momentum7d < -10) score -= 2;
  else if (momentum7d < -5) score -= 1;

  if (momentum30d > 20) score += 2;
  else if (momentum30d > 10) score += 1;
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
