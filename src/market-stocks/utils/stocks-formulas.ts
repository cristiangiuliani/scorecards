import type { TStocksData } from '../../interfaces/market-stocks';

export const calculateVixScore = (value = 0): number => {
  // VIX = "fear index" - ALTO = bearish, BASSO = bullish
  // ⚠️ CORRETTO rispetto alla versione precedente!
  if (value > 40) return -4;   // Paura estrema (bearish)
  if (value > 30) return -3;   // Alta volatilità (bearish)
  if (value > 25) return -1;   // Volatilità elevata
  if (value < 12) return 2;    // Complacency (bullish)
  if (value < 15) return 1;    // Bassa volatilità (bullish)
  return 0;  // Normale (15-25)
};

export const calculateRsiScore = (value = 0): number => {
  // RSI S&P500 - con soglie migliorate
  if (value > 85) return -4;   // Estremo ipercomprato
  if (value > 80) return -3;   // Molto ipercomprato
  if (value > 70) return -2;   // ⬅️ AGGIUNTO: ipercomprato classico
  if (value > 65) return -1;   // ⬅️ AGGIUNTO: leggero ipercomprato
  if (value < 15) return 4;    // Estremo ipervenduto
  if (value < 20) return 3;    // Molto ipervenduto
  if (value < 30) return 2;    // Ipervenduto
  if (value < 35) return 1;    // Leggero ipervenduto
  return 0;  // Neutrale (35-65)
};

export const calculateEurUsdScore = (value = 0): number => {
  // EUR/USD - più granulare
  if (value < 1.02) return 3;   // Dollar molto forte (risk-off)
  if (value < 1.05) return 2;   // Dollar forte
  if (value < 1.08) return 1;   // Dollar leggermente forte
  if (value > 1.20) return -2;  // Dollar debole (risk-on)
  if (value > 1.15) return -1;  // Dollar leggermente debole
  return 0;  // Range normale (1.08-1.15)
};

export const calculateFearGreedScore = (value = 0): number => {
  // Fear & Greed (stocks) - più granulare
  if (value < 15) return 4;    // Extreme fear (opportunity)
  if (value < 25) return 3;    // Fear (buying opportunity)
  if (value < 40) return 1;    // Some fear
  if (value > 85) return -4;   // Extreme greed (danger)
  if (value > 75) return -3;   // Greed (caution)
  if (value > 60) return -1;   // Some greed
  return 0;  // Neutral (40-60)
};

// ============================================
// NUOVE FORMULE INDICATORI
// ============================================

export const calculateAthDistanceScore = (current: number, ath: number): number => {
  if (!current || !ath) return 0;

  const distance = (current / ath) * 100;

  if (distance > 99) return 3;    // Near ATH (strong bullish)
  if (distance > 95) return 2;    // Close to ATH (bullish)
  if (distance > 90) return 1;    // Above 90% (mild bullish)
  if (distance < 70) return -3;   // Deep correction (bearish)
  if (distance < 80) return -2;   // Correction (mild bearish)
  if (distance < 85) return -1;   // Pullback
  return 0;  // Normal range (85-90%)
};

export const calculateMomentumScore = (prices: number[]): number => {
  if (!prices || prices.length < 30) return 0;

  const current = prices[prices.length - 1];
  const day7ago = prices[prices.length - 8];
  const day30ago = prices[0];

  const momentum7d = ((current - day7ago) / day7ago) * 100;
  const momentum30d = ((current - day30ago) / day30ago) * 100;

  let score = 0;

  // 7-day momentum
  if (momentum7d > 5) score += 2;
  else if (momentum7d > 2) score += 1;
  else if (momentum7d < -5) score -= 2;
  else if (momentum7d < -2) score -= 1;

  // 30-day momentum
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

  // Price vs MA50
  if (current > ma50 * 1.05) score += 2;
  else if (current > ma50) score += 1;
  else if (current < ma50 * 0.95) score -= 2;
  else if (current < ma50) score -= 1;

  // MA50 vs MA200 (Golden/Death Cross)
  if (ma50 > ma200 * 1.02) score += 2;
  else if (ma50 > ma200) score += 1;
  else if (ma50 < ma200 * 0.98) score -= 2;
  else if (ma50 < ma200) score -= 1;

  return score;
};

export const calculatePutCallScore = (ratio: number): number => {
  if (!ratio) return 0;

  // Put/Call Ratio - alto = bearish, basso = bullish
  if (ratio > 1.3) return 3;    // Molto bearish sentiment (contrarian buy)
  if (ratio > 1.1) return 2;    // Bearish sentiment
  if (ratio > 0.9) return 1;    // Cauto
  if (ratio < 0.5) return -3;   // Eccessiva confidenza (danger)
  if (ratio < 0.7) return -2;   // Troppo bullish sentiment
  if (ratio < 0.8) return -1;   // Bullish sentiment
  return 0;  // Balanced (0.8-0.9)
};

export const calculateTreasury10YScore = (yield10Y: number): number => {
  if (!yield10Y) return 0;

  // Treasury Yield alto = tassi alti = bearish per stocks
  if (yield10Y > 5.0) return -3;   // Molto alto (bearish)
  if (yield10Y > 4.5) return -2;   // Alto (bearish)
  if (yield10Y > 4.0) return -1;   // Elevato
  if (yield10Y < 2.5) return 2;    // Molto basso (bullish)
  if (yield10Y < 3.0) return 1;    // Basso (bullish)
  return 0;  // Normale (3.0-4.0)
};

// ============================================
// CALCOLO SCORE COMPLETO (AGGIORNATO)
// ============================================

export const calculateStocksScore = (data: TStocksData): number => {
  if (!data) return 0;

  // Indicatori esistenti
  const vixScore = data?.vix ? calculateVixScore(data.vix) : 0;
  const rsiScore = data?.rsiSP500 ? calculateRsiScore(data.rsiSP500) : 0;
  const eurUsdScore = data?.eurUsd ? calculateEurUsdScore(data.eurUsd) : 0;
  const fearGreedScore = data?.fearGreed ? calculateFearGreedScore(data.fearGreed) : 0;

  // Nuovi indicatori
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

  // Weighted score (ribilanciato)
  const weightedScore =
    (vixScore * 1.3) +           // VIX importante
    (rsiScore * 1.0) +           // Ridotto da 1.2
    (eurUsdScore * 0.5) +        // Ridotto da 0.8 (meno rilevante)
    (fearGreedScore * 1.2) +     // Mantenuto
    (athDistanceScore * 1.8) +   // NUOVO - peso alto!
    (momentumScore * 1.5) +      // NUOVO - peso alto!
    (maScore * 1.2) +            // NUOVO
    (putCallScore * 0.8) +       // NUOVO - sentiment
    (treasury10YScore * 1.0);    // NUOVO - macro context

  return weightedScore * 0.5;    // Ridotto da 0.6
};
