import type { IBubbleIndicator } from '../../interfaces/market-bubble';
import type { TInterpretation } from '../../types/data.type';

export function getBubbleInterpretation(indicator: IBubbleIndicator): TInterpretation {
  const {
    score,
  } = indicator;

  if (score <= -7) {
    // STRONG BEARISH/HIGH RISK
    if (score === -10) {
      return {
        text: 'CRITICAL',
        color: 'error',
        severity: 'error',
      };
    }
    return {
      text: 'HIGH RISK',
      color: 'error',
      severity: 'error',
    };
  }

  if (score <= -3) {
    return {
      text: 'MODERATE RISK',
      color: 'default',
      severity: 'warning',
    };
  }

  if (score > -3) {
    return {
      text: 'LOW RISK',
      color: 'success',
      severity: 'success',
    };
  }

  return {
    text: '🚀 LOW RISK',
    color: 'success',
    severity: 'success',
  };
}

export function getPortfolioRecommendation(risk: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (risk) {
    case 'HIGH':
      return 'Reduce AI/tech exposure to 20-30%. Increase defensive positions and cash reserves.';
    case 'MEDIUM':
      return 'Maintain 40-50% AI/tech exposure. Consider taking profits on winners. Set stop losses.';
    case 'LOW':
      return 'Standard diversified portfolio OK. AI/tech allocation can remain at 50-60%.';
  }
}

export function getSectorRecommendation(risk: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (risk) {
    case 'HIGH':
      return 'Rotate to: Healthcare, Utilities, Consumer Staples, Cash';
    case 'MEDIUM':
      return 'Balance: 50% Tech + 50% Defensive (Healthcare, Industrials)';
    case 'LOW':
      return 'Tech-focused OK: Semiconductors, Software, AI Infrastructure';
  }
}

export function getTimingRecommendation(risk: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (risk) {
    case 'HIGH':
      return 'SELL or heavily trim positions NOW. Wait for correction before re-entry.';
    case 'MEDIUM':
      return 'HOLD winners with tight stops. Pause new entries. Wait for clarity.';
    case 'LOW':
      return 'BUY opportunistically on dips. Good risk/reward for new positions.';
  }
}

export function getActionableTips(indicator: IBubbleIndicator): string[] {
  const { risk, factors } = indicator;
  const tips: string[] = [];

  if (risk === 'HIGH') {
    tips.push('Immediate: Set stop-losses on all AI/tech positions at -15%');
    tips.push('Take profits: Sell 50-70% of winners, secure capital');
    tips.push('Hedge: Consider inverse ETFs (SQQQ) or put options');
    tips.push('Cash is a position: Raise cash to 30-40% of portfolio');
  } else if (risk === 'MEDIUM') {
    tips.push('Rebalance: Trim winners to original allocation');
    tips.push('Selective: Hold best quality names, exit speculative');
    tips.push('Stops: Set trailing stops at -10% to protect gains');
    tips.push('Watch: Monitor daily for deterioration');
  } else {
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
