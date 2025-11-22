import { COMMON_LABELS } from '../../constants/labels';
import type { TInterpretation } from '../../types/data.type';

export const getBondsInterpretation = (score: number): TInterpretation => {
  if (score > 7) {
    return {
      text: COMMON_LABELS.StrongBuy,
      color: 'success',
      severity: 'success',
    };
  }
  if (score > 4) {
    return {
      text: COMMON_LABELS.Buy,
      color: 'success',
      severity: 'info',
    };
  }
  if (score > 1) {
    return {
      text: COMMON_LABELS.ModerateBuy,
      color: 'info',
      severity: 'info',
    };
  }
  if (score > -1) {
    return {
      text: COMMON_LABELS.Neutral,
      color: 'info',
      severity: 'info',
    };
  }
  if (score > -4) {
    return {
      text: COMMON_LABELS.ModerateSell,
      color: 'warning',
      severity: 'warning',
    };
  }
  if (score > -7) {
    return {
      text: COMMON_LABELS.Sell,
      color: 'error',
      severity: 'warning',
    };
  }
  return {
    text: COMMON_LABELS.StrongSell,
    color: 'error',
    severity: 'error',
  };
};

export function getDurationStrategy(score: number, yieldSlope: number): string {
  if (score > 6) {
    return yieldSlope > 1.0
      ? 'Long duration - Steep curve favorable'
      : 'Long duration - Rates likely to fall';
  }
  if (score > 3) {
    return yieldSlope > 0.5
      ? 'Extended duration - Normal curve'
      : 'Extended duration - Cautious positioning';
  }
  if (score > 0) {
    return 'Moderate duration - Barbell strategy';
  }
  if (score > -3) {
    return yieldSlope < 0
      ? 'Short duration - Inverted curve risk'
      : 'Short duration - Rising rate environment';
  }
  return 'Minimal duration - Defensive positioning';
}

export function getBondAllocation(score: number): string {
  if (score > 7) return '80-100% bonds allocation';
  if (score > 4) return '60-80% bonds allocation';
  if (score > 1) return '40-60% bonds allocation';
  if (score > -1) return '30-40% bonds allocation';
  if (score > -4) return '20-30% bonds allocation';
  if (score > -7) return '10-20% bonds allocation';
  return '0-10% bonds allocation - Avoid';
}

export function getRiskLevel(
  score: number,
  yieldSlope: number,
  creditSpreads: number
): string {
  if (yieldSlope < -0.5 || creditSpreads > 300) {
    return 'High Risk - Recession signals present';
  }
  if (score < -4) {
    return 'High Risk - Rising rate environment';
  }
  if (score > 6 && yieldSlope > 1.0) {
    return 'Low Risk - Favorable conditions';
  }
  if (score > 3) {
    return 'Moderate Risk - Supportive environment';
  }
  if (score > -3) {
    return 'Moderate Risk - Mixed signals';
  }
  return 'Elevated Risk - Challenging conditions';
}

export function getSectorRecommendation(
  score: number,
  yieldSlope: number,
  inflation: number
): string {
  if (inflation > 3.5) {
    return 'TIPS (Inflation-Protected) - High inflation';
  }
  if (score > 5 && yieldSlope > 0.8) {
    return 'Long-term Treasuries - Bullish setup';
  }
  if (score > 2) {
    return 'Intermediate Treasuries (5-7Y) - Balanced';
  }
  if (yieldSlope < 0) {
    return 'Short-term Treasuries (<2Y) - Inverted curve';
  }
  if (score < -3) {
    return 'Money Market / T-Bills - Defensive';
  }
  return 'Diversified ladder - Uncertain environment';
}

export function getTimingSignal(score: number): string {
  if (score > 7) {
    return 'Strong Buy - Accumulate positions';
  }
  if (score > 4) {
    return 'Buy - Build positions gradually';
  }
  if (score > 1) {
    return 'Moderate Buy - Small additions';
  }
  if (score > -1) {
    return 'Hold - Wait for clearer signals';
  }
  if (score > -4) {
    return 'Reduce - Trim positions';
  }
  if (score > -7) {
    return 'Sell - Significant reduction';
  }
  return 'Strong Sell - Exit positions';
}

export function getMarketPhase(
  score: number,
  yieldSlope: number,
  creditSpreads: number
): string {
  if (yieldSlope < -0.5 && creditSpreads > 250) {
    return 'Pre-Recession - Flight to quality phase';
  }
  if (score > 6 && yieldSlope > 1.2) {
    return 'Bull Market - Strong momentum';
  }
  if (score > 3) {
    return 'Uptrend - Favorable conditions';
  }
  if (score > -3 && Math.abs(yieldSlope) < 0.5) {
    return 'Consolidation - Range-bound';
  }
  if (score < -4) {
    return 'Bear Market - Rising rates pressuring bonds';
  }
  return 'Transitional - Mixed signals';
}

export function getActionableTips(
  score: number,
  yieldSlope: number,
  creditSpreads: number,
  inflation: number
): string[] {
  const tips: string[] = [];

  if (score > 7) {
    tips.push('Maximize duration to capture rate decreases');
    tips.push('Consider zero-coupon treasuries for leveraged exposure');
    tips.push('Lock in current yields with long-term bonds');
    tips.push('Reduce cash holdings in favor of bonds');
  } else if (score > 4) {
    tips.push('Increase bond allocation gradually');
    tips.push('Focus on intermediate to long duration (7-30Y)');
    tips.push('Consider bond funds for diversification');
    tips.push('Monitor Fed policy for entry points');
  } else if (score > 1) {
    tips.push('Maintain balanced duration exposure');
    tips.push('Use laddered strategy across maturities');
    tips.push('Keep some dry powder for better opportunities');
    tips.push('Review portfolio periodically');
  } else if (score > -1) {
    tips.push('Stay neutral - no strong conviction either way');
    tips.push('Use barbell strategy (short + long term)');
    tips.push('Monitor economic data closely');
    tips.push('Wait for clearer trends before major moves');
  } else if (score > -4) {
    tips.push('Reduce duration exposure to limit losses');
    tips.push('Shift to shorter maturities (1-3Y)');
    tips.push('Consider floating rate notes');
    tips.push('Increase cash allocation');
  } else if (score > -7) {
    tips.push('Move to T-Bills and money markets');
    tips.push('Avoid long-term bonds completely');
    tips.push('Wait for rates to stabilize before re-entry');
    tips.push('Consider alternative income sources');
  } else {
    tips.push('Exit all long-duration positions immediately');
    tips.push('Move to ultra-short treasuries (<6 months)');
    tips.push('Preserve capital in money market funds');
    tips.push('Avoid bonds until conditions improve significantly');
  }

  // Add specific tips based on curve and spreads
  if (yieldSlope < -0.5) {
    tips.push('ALERT: Inverted curve - Recession risk elevated');
  }
  if (creditSpreads > 300) {
    tips.push('ALERT: Wide credit spreads - Credit stress present');
  }
  if (inflation > 4.0) {
    tips.push('Consider TIPS for inflation protection');
  }

  return tips.slice(0, 4); // Max 4 tips
}
