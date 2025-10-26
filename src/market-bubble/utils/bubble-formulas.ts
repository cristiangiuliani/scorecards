import type { IBubbleData, IBubbleIndicator } from '../../interfaces/market-bubble';

const NVIDIA_PE_THRESHOLD = 65;
const NASDAQ_PE_THRESHOLD = 38;
const VIX_THRESHOLD = 30;
const VIX_PERSISTENCE_DAYS = 3;

export function calculateNvidiaPEScore(nvidiaPE: number | undefined): number {
  if (!nvidiaPE) return 0;

  if (nvidiaPE > NVIDIA_PE_THRESHOLD) return 1;
  if (nvidiaPE > NVIDIA_PE_THRESHOLD * 0.9) return 0.5; // Warning zone (>58.5)
  return 0;
}

export function calculateNasdaqPEScore(nasdaqPE: number | undefined): number {
  if (!nasdaqPE) return 0;

  if (nasdaqPE > NASDAQ_PE_THRESHOLD) return 1;
  if (nasdaqPE > NASDAQ_PE_THRESHOLD * 0.9) return 0.5; // Warning zone (>34.2)
  return 0;
}

export function calculateVixPersistenceScore(vixHistory: number[] | undefined): number {
  if (!vixHistory || vixHistory.length < VIX_PERSISTENCE_DAYS) return 0;

  const isPersistent = isVixPersistent(vixHistory);
  if (isPersistent) return 1;

  const daysAboveThreshold = vixHistory.slice(-5).filter((v) => v > VIX_THRESHOLD).length;
  if (daysAboveThreshold >= 2) return 0.5;

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
  const vixScore = calculateVixPersistenceScore(data.vixHistory);

  const totalScore = nvidiaScore + nasdaqScore + vixScore;

  const nvidiaOvervalued = (data.nvidiaPE ?? 0) > NVIDIA_PE_THRESHOLD;
  const nasdaqOvervalued = (data.nasdaqPE ?? 0) > NASDAQ_PE_THRESHOLD;
  const vixPersistent = data.vixHistory ? isVixPersistent(data.vixHistory) : false;

  let risk: 'LOW' | 'MEDIUM' | 'HIGH';
  if (totalScore >= 2.5) {
    risk = 'HIGH';
  } else if (totalScore >= 1) {
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
  return bubbleIndicator.risk === 'HIGH'
    ? 8 + (bubbleIndicator.score - 2.5) * 4  // 8-10
    : bubbleIndicator.risk === 'MEDIUM'
      ? 3 + (bubbleIndicator.score - 1) * 3     // 3-7
      : bubbleIndicator.score * 3;              // 0-3
};
