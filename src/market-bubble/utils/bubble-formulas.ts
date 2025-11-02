import type { IBubbleData, IBubbleIndicator } from '../../interfaces/market-bubble';

const NVIDIA_PE_THRESHOLD = 65;
const NASDAQ_PE_THRESHOLD = 38;
const VIX_THRESHOLD = 30;
const VIX_PERSISTENCE_DAYS = 3;

export function calculateNvidiaPEScore(nvidiaPE: number | undefined): number {
  if (!nvidiaPE) return 0;

  if (nvidiaPE > NVIDIA_PE_THRESHOLD) return -3.3;
  if (nvidiaPE > NVIDIA_PE_THRESHOLD * 0.9) return -1.7; // Warning zone (>58.5)
  return 0;
}

export function calculateNasdaqPEScore(nasdaqPE: number | undefined): number {
  if (!nasdaqPE) return 0;

  if (nasdaqPE > NASDAQ_PE_THRESHOLD) return -3.3;
  if (nasdaqPE > NASDAQ_PE_THRESHOLD * 0.9) return -1.7; // Warning zone (>34.2)
  return 0;
}

export function calculateVixPersistenceScore(vixHistory: number[] | undefined): number {
  if (!vixHistory || vixHistory.length < VIX_PERSISTENCE_DAYS) return 0;

  const isPersistent = isVixPersistent(vixHistory);
  if (isPersistent) return -3.4;

  const daysAboveThreshold = vixHistory.slice(-5).filter((v) => v > VIX_THRESHOLD).length;
  if (daysAboveThreshold >= 2) return -1.7;

  return 0;
}

export function calculateNvdaNasdaqRatioScore(
  nvidiaPE: number | undefined,
  nasdaqPE: number | undefined
): number {
  if (!nvidiaPE || !nasdaqPE) return 0;

  const ratio = nvidiaPE / nasdaqPE;

  // Ratio > 2.0 indicates NVIDIA is significantly overvalued vs NASDAQ
  if (ratio > 2.0) return -2.0;
  // Ratio > 1.7 is warning zone
  if (ratio > 1.7) return -1.0;

  return 0;
}

export function calculateFearGreedScore(fearGreed: number | undefined): number {
  if (!fearGreed) return 0;

  // Extreme greed (>75) indicates bubble risk
  if (fearGreed > 75) return -2.0;
  // Greed zone (>60)
  if (fearGreed > 60) return -1.0;

  return 0;
}

export function calculateRsiScore(rsi: number | undefined): number {
  if (!rsi) return 0;

  // Severely overbought (>75) indicates correction risk
  if (rsi > 75) return -2.0;
  // Overbought zone (>70)
  if (rsi > 70) return -1.0;

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

  let risk: 'LOW' | 'MEDIUM' | 'HIGH';
  if (totalScore <= -9) {
    risk = 'HIGH';
  } else if (totalScore <= -4) {
    risk = 'MEDIUM';
  } else {
    risk = 'LOW';
  }

  return {
    risk,
    score: totalScore,
    factors: {
      nvidiaOvervalued,
      nasdaqOvervalued,
      vixPersistent,
    },
  };
}

export const displayScoreRisk = (bubbleIndicator: IBubbleIndicator): number => {
  return Math.abs(bubbleIndicator.score);
};
