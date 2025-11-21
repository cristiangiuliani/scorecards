import type { IBubbleData, IBubbleIndicator } from '../../interfaces/market-bubble';

const NVIDIA_PE_THRESHOLD = 65;
const NASDAQ_PE_THRESHOLD = 38;
const VIX_THRESHOLD = 30;
const VIX_PERSISTENCE_DAYS = 3;

export function calculateNvidiaPEScore(nvidiaPE: number | undefined): number {
  if (!nvidiaPE) return 0;

  const threshold = NVIDIA_PE_THRESHOLD; // 65
  // High P/E = high risk (negative score), Low P/E = low risk (positive score)
  if (nvidiaPE >= threshold) return -4;
  if (nvidiaPE >= threshold * 0.9) return -2.5 - ((nvidiaPE - threshold * 0.9) / (threshold * 0.1)) * 1.5; // -2.5 to -4
  if (nvidiaPE > threshold * 0.75) return ((threshold * 0.9 - nvidiaPE) / (threshold * 0.15)) * 2.5; // 0 to -2.5
  if (nvidiaPE >= threshold * 0.6) return 2 + ((threshold * 0.75 - nvidiaPE) / (threshold * 0.15)) * 2; // 2 to 0
  return 4 - Math.min(2, (threshold * 0.6 - nvidiaPE) / (threshold * 0.2) * 2); // 2 to 4
}

export function calculateNasdaqPEScore(nasdaqPE: number | undefined): number {
  if (!nasdaqPE) return 0;

  const threshold = NASDAQ_PE_THRESHOLD; // 38
  // High P/E = high risk (negative score), Low P/E = low risk (positive score)
  if (nasdaqPE >= threshold) return -4;
  if (nasdaqPE >= threshold * 0.9) return -2.5 - ((nasdaqPE - threshold * 0.9) / (threshold * 0.1)) * 1.5; // -2.5 to -4
  if (nasdaqPE > threshold * 0.75) return ((threshold * 0.9 - nasdaqPE) / (threshold * 0.15)) * 2.5; // 0 to -2.5
  if (nasdaqPE >= threshold * 0.6) return 2 + ((threshold * 0.75 - nasdaqPE) / (threshold * 0.15)) * 2; // 2 to 0
  return 4 - Math.min(2, (threshold * 0.6 - nasdaqPE) / (threshold * 0.2) * 2); // 2 to 4
}

export function calculateVixPersistenceScore(vixHistory: number[] | undefined): number {
  if (!vixHistory || vixHistory.length < VIX_PERSISTENCE_DAYS) return 0;

  const isPersistent = isVixPersistent(vixHistory);
  if (isPersistent) return -3.4; // High risk

  const daysAboveThreshold = vixHistory.slice(-5).filter((v) => v > VIX_THRESHOLD).length;
  if (daysAboveThreshold >= 2) return -1.7; // Warning

  // Check for low VIX (calm market = low risk)
  const recentValues = vixHistory.slice(-5);
  const avgVix = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  if (avgVix < 15) return 3.4; // Very low risk
  if (avgVix < 20) return 1.7; // Low risk

  return 0;
}

export function calculateNvdaNasdaqRatioScore(
  nvidiaPE: number | undefined,
  nasdaqPE: number | undefined
): number {
  if (!nvidiaPE || !nasdaqPE) return 0;

  const ratio = nvidiaPE / nasdaqPE;

  // Ratio > 2.0 = NVIDIA significantly overvalued vs NASDAQ (high risk)
  if (ratio >= 2.0) return -2;
  if (ratio >= 1.7) return -1 - ((ratio - 1.7) / 0.3); // -1 to -2
  if (ratio > 1.4) return (1.7 - ratio) / 0.3; // 0 to -1
  if (ratio >= 1.2) return 1 - ((1.4 - ratio) / 0.2); // 1 to 0
  return 2 - Math.min(1, (1.2 - ratio) / 0.4); // 1 to 2
}

export function calculateFearGreedScore(fearGreed: number | undefined): number {
  if (!fearGreed) return 0;

  // Extreme greed (>75) indicates bubble risk
  if (fearGreed > 85) return -4; // Very high risk
  if (fearGreed > 75) return -3; // High risk
  if (fearGreed > 60) return -1; // Warning
  // Fear zone (<40) indicates low bubble risk
  if (fearGreed < 15) return 4; // Very low risk
  if (fearGreed < 25) return 3; // Low risk
  if (fearGreed < 40) return 1; // Safe zone

  return 0;
}

export function calculateRsiScore(rsi: number | undefined): number {
  if (!rsi) return 0;

  // Severely overbought indicates correction risk
  if (rsi > 80) return -4; // Very high risk
  if (rsi > 75) return -3; // High risk
  if (rsi > 70) return -2; // Warning
  // Oversold zone indicates low bubble risk
  if (rsi < 20) return 4; // Very low risk
  if (rsi < 30) return 3; // Low risk
  if (rsi < 40) return 1; // Safe zone

  return 0;
}

export function isVixPersistent(vixHistory: number[]): boolean {
  if (vixHistory.length < VIX_PERSISTENCE_DAYS) return false;

  const recentValues = vixHistory.slice(-5);
  let consecutiveDays = 0;
  let maxConsecutive = 0;

  for (const vix of recentValues) {
    if (vix > VIX_THRESHOLD) {
      consecutiveDays++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
    } else {
      consecutiveDays = 0;
    }
  }

  return maxConsecutive >= VIX_PERSISTENCE_DAYS;
}

export function calculateBubbleRisk(data: IBubbleData): IBubbleIndicator {
  const nvidiaScore = calculateNvidiaPEScore(data.nvidiaPE);
  const nasdaqScore = calculateNasdaqPEScore(data.nasdaqPE);
  const ratioScore = calculateNvdaNasdaqRatioScore(data.nvidiaPE, data.nasdaqPE);
  const vixScore = calculateVixPersistenceScore(data.vixHistory);
  const fearGreedScore = calculateFearGreedScore(data.fearGreed);
  const rsiScore = calculateRsiScore(data.rsiSP500);

  const totalScore = nvidiaScore + nasdaqScore + ratioScore + vixScore + fearGreedScore + rsiScore;

  const nvidiaOvervalued = (data.nvidiaPE ?? 0) > NVIDIA_PE_THRESHOLD;
  const nasdaqOvervalued = (data.nasdaqPE ?? 0) > NASDAQ_PE_THRESHOLD;
  const vixPersistent = data.vixHistory ? isVixPersistent(data.vixHistory) : false;

  return {
    score: totalScore,
    factors: {
      nvidiaOvervalued,
      nasdaqOvervalued,
      vixPersistent,
    },
  };
}

export const displayScoreRisk = (bubbleIndicator: IBubbleIndicator): number => {
  // Normalize score from [-16, +16] range to [-10, +10] range
  // Invert the score so that positive values = high risk (right side of gauge)
  // and negative values = low risk (left side of gauge)
  // Clamp to ensure we stay within bounds
  const normalizedScore = Math.max(-10, Math.min(10, bubbleIndicator.score * (10 / 16)));
  return -normalizedScore; // Invert for gauge display
};
