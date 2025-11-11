import type {
  TInterpretation,
} from '../../types/data.type';

export const getCryptoInterpretation = (score:number):TInterpretation => {
  if (score > 7) return {
    text: 'STRONG BULL RUN',
    color: 'success',
    severity: 'success',
  };
  if (score > 3) return {
    text: 'CRYPTO BULLISH',
    color: 'success',
    severity: 'info',
  };
  if (score > -3) return {
    text: 'CRAB MARKET',
    color: 'default',
    severity: 'info',
  };
  if (score > -7) return {
    text: 'CRYPTO BEARISH',
    color: 'warning',
    severity: 'warning',
  };
  return {
    text: 'CRYPTO WINTER',
    color: 'error',
    severity: 'error',
  };
};

export function getMarketPhase(score: number, athDistance: number): string {
  if (score > 5) {
    return 'Extreme bull - Near cycle top';
  }
  if (score > 3) {
    if (athDistance > 95) {
      return 'Late bull market - ATH zone';
    }
    return 'Active bull market';
  }
  if (score > 0) {
    return 'Early bull / Recovery phase';
  }
  if (score > -3) {
    return 'Consolidation / Accumulation';
  }
  if (score > -6) {
    return 'Bear market - Correction phase';
  }
  return 'Crypto winter - Deep bear';
}

export function getBtcAltBalance(dominance: number, altSeasonIndex = 50): string {
  if (dominance > 65) {
    return 'Heavy BTC focus - Altcoins weak';
  }
  if (dominance > 60) {
    return '70% BTC / 30% quality alts';
  }
  if (dominance > 55) {
    return '60% BTC / 40% alts (balanced)';
  }
  if (dominance > 50) {
    return '50/50 BTC/Alts - Alt momentum';
  }
  if (dominance > 45) {
    if (altSeasonIndex > 75) {
      return 'Active altseason - 30% BTC / 70% alts';
    }
    return '40% BTC / 60% alts';
  }
  return 'Full altseason - Focus quality alts';
}

export function getRiskLevel(
  score: number,
  rsi: number,
  fearGreed: number,
  athDistance: number
): string {
  let riskScore = 0;

  if (Math.abs(score) > 6) riskScore += 3;
  else if (Math.abs(score) > 4) riskScore += 2;
  else if (Math.abs(score) > 2) riskScore += 1;

  if (rsi > 80 || rsi < 20) riskScore += 2;
  else if (rsi > 70 || rsi < 30) riskScore += 1;

  if (fearGreed > 85 || fearGreed < 15) riskScore += 2;
  else if (fearGreed > 75 || fearGreed < 25) riskScore += 1;

  if (score > 2 && athDistance > 98) riskScore += 2;
  else if (score > 2 && athDistance > 95) riskScore += 1;

  if (riskScore >= 7) {
    return 'EXTREME - Reduce exposure now';
  }
  if (riskScore >= 5) {
    return 'Very High - Take profits gradually';
  }
  if (riskScore >= 3) {
    return 'High - Set stop losses';
  }
  if (riskScore >= 1) {
    return 'Moderate - Active monitoring';
  }
  return 'Low - Good for DCA/accumulation';
}

export function getActionableTips(
  score: number,
  rsi: number,
  fearGreed: number,
  athDistance: number,
  dominance: number
): string[] {
  const tips: string[] = [];

  if (score > 7) {
    tips.push('Start taking profits (25-50%)');
    tips.push('Set trailing stops at -10%');
  } else if (score > 3) {
    tips.push('Rebalance: secure initial capital');
    tips.push('Let winners run with stops');
  } else if (score > 0) {
    tips.push('Good time to add positions');
    tips.push('Scale in gradually (DCA)');
  } else if (score > -3) {
    tips.push('Consolidation phase - wait for trend');
    tips.push('Preserve capital, avoid overtrading');
  } else if (score <= -3) {
    tips.push('Strong accumulation zone');
    tips.push('Be patient, bear markets = opportunity');
  }

  if (rsi > 70) {
    tips.push('RSI overbought - prepare for pullback');
  } else if (rsi < 30) {
    tips.push('RSI oversold - buying opportunity');
  }

  if (athDistance > 98 && score > 3) {
    tips.push('Near ATH - avoid FOMO, wait pullback');
  } else if (athDistance < 50) {
    tips.push('Far from ATH - good risk/reward');
  }

  if (dominance < 50) {
    tips.push('Altseason active - rotate into alts');
  } else if (dominance > 65) {
    tips.push('₿ BTC dominance high - focus on BTC');
  }

  if (fearGreed > 75) {
    tips.push('Extreme greed - market overheated');
  } else if (fearGreed < 30) {
    tips.push('Extreme fear - contrarian opportunity');
  }
  return tips.slice(0, 4); // Max 4 tips
}

export function getTimeHorizon(score: number, momentum: number): string {
  if (score > 4 && momentum > 10) {
    return 'Short-term focus (days/weeks)';
  }
  if (score > 2) {
    return 'Medium-term trend (weeks/months)';
  }
  if (score > -2) {
    return 'Long-term accumulation (months)';
  }
  if (score < -4) {
    return 'Multi-year hold (2-4 years)';
  }
  return 'Medium-long term (3-12 months)';
}
