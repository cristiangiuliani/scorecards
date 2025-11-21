import { COMMON_LABELS } from '../../constants/labels';
import type { IBubbleIndicator } from '../../interfaces/market-bubble';
import type { TInterpretation } from '../../types/data.type';

export function getBubbleInterpretation(indicator: IBubbleIndicator): TInterpretation {
  const {
    score,
  } = indicator;

  // Score has been inverted in displayScoreRisk:
  // Negative values = LOW risk (good) - left side of gauge
  // Positive values = HIGH risk (bubble warning) - right side of gauge

  if (score >= 7) {
    // CRITICAL BUBBLE RISK
    return {
      text: COMMON_LABELS.Critical,
      color: 'error',
      severity: 'error',
    };
  }

  if (score >= 3) {
    // HIGH BUBBLE RISK
    return {
      text: COMMON_LABELS.HighRisk,
      color: 'error',
      severity: 'error',
    };
  }

  if (score > -3 && score < 3) {
    // MODERATE/NEUTRAL
    return {
      text: COMMON_LABELS.ModerateRisk,
      color: 'default',
      severity: 'warning',
    };
  }

  if (score <= -7) {
    // VERY LOW RISK
    return {
      text: COMMON_LABELS.VeryLowRisk,
      color: 'success',
      severity: 'success',
    };
  }

  // LOW RISK
  return {
    text: COMMON_LABELS.LowRisk,
    color: 'success',
    severity: 'success',
  };
}

export function getPortfolioRecommendation(score: number): string {
  if (score <= -9) {
    return 'Reduce AI/tech exposure to 20-30%. Increase defensive positions and cash reserves.';
  }
  if (score <= -4) {
    return 'Maintain 40-50% AI/tech exposure. Consider taking profits on winners. Set stop losses.';
  }
  return 'Standard diversified portfolio OK. AI/tech allocation can remain at 50-60%.';
}

export function getSectorRecommendation(score: number): string {
  if (score <= -9) {
    return 'Rotate to: Healthcare, Utilities, Consumer Staples, Cash';
  }
  if (score <= -4) {
    return 'Balance: 50% Tech + 50% Defensive (Healthcare, Industrials)';
  }
  return 'Tech-focused OK: Semiconductors, Software, AI Infrastructure';
}

export function getTimingRecommendation(score: number): string {
  if (score <= -9) {
    return 'SELL or heavily trim positions NOW. Wait for correction before re-entry.';
  }
  if (score <= -4) {
    return 'HOLD winners with tight stops. Pause new entries. Wait for clarity.';
  }
  return 'BUY opportunistically on dips. Good risk/reward for new positions.';
}

export function getActionableTips(indicator: IBubbleIndicator): string[] {
  const { score, factors } = indicator;
  const tips: string[] = [];

  if (score <= -9) {
    // HIGH RISK
    tips.push('Immediate: Set stop-losses on all AI/tech positions at -15%');
    tips.push('Take profits: Sell 50-70% of winners, secure capital');
    tips.push('Hedge: Consider inverse ETFs (SQQQ) or put options');
    tips.push('Cash is a position: Raise cash to 30-40% of portfolio');
  } else if (score <= -4) {
    // MEDIUM RISK
    tips.push('Rebalance: Trim winners to original allocation');
    tips.push('Selective: Hold best quality names, exit speculative');
    tips.push('Stops: Set trailing stops at -10% to protect gains');
    tips.push('Watch: Monitor daily for deterioration');
  } else {
    // LOW RISK
    tips.push('Stay invested: No bubble signals detected');
    tips.push('Accumulate: Good time to add to quality positions');
    tips.push('DCA: Dollar-cost average into favorites');
    tips.push('Opportunistic: Buy dips in strong names');
  }

  if (factors.nvidiaOvervalued) {
    tips.push('NVIDIA: Reduce exposure, P/E too extended');
  }
  if (factors.nasdaqOvervalued) {
    tips.push('NASDAQ: Broad market overvalued, be cautious');
  }
  if (factors.vixPersistent) {
    tips.push('VIX: Persistent fear = increased crash risk');
  }

  return tips.slice(0, 6); // Max 6 tips
}
