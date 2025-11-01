import type { TInterpretation } from '../../types/data.type';

export const getStockInterpretation = (score: number): TInterpretation => {
  if (score > 7) return {
    text: '🚀 STRONG BULLISH',
    color: 'success',
    severity: 'success',
  };
  if (score > 3) return {
    text: '🟢 BULLISH',
    color: 'success',
    severity: 'info',
  };
  if (score > -3) return {
    text: '⚪ NEUTRAL',
    color: 'default',
    severity: 'info',
  };
  if (score > -7) return {
    text: '🟡 BEARISH',
    color: 'warning',
    severity: 'warning',
  };
  return {
    text: '🔴 STRONG BEARISH',
    color: 'error',
    severity: 'error',
  };
};

export function getMarketPhase(score: number, athDistance: number, vix: number): string {
  if (score > 6) {
    return 'Bull market peak - High euphoria';
  }
  if (score > 3) {
    if (athDistance > 98 && vix < 15) {
      return 'Late bull - Complacent market';
    }
    return 'Active bull market';
  }
  if (score > 0) {
    return 'Recovery phase - Early bull';
  }
  if (score > -3) {
    if (vix > 25) {
      return 'Volatility spike - Uncertainty';
    }
    return 'Consolidation / Range-bound';
  }
  if (score > -6) {
    return 'Bear market - Correction phase';
  }
  return 'Bear market - Capitulation';
}

export function getPortfolioAllocation(score: number, vix: number): string {
  if (score > 6) {
    return '50% Stocks / 30% Bonds / 20% Cash';
  }
  if (score > 3) {
    if (vix < 15) {
      return '70% Stocks / 20% Bonds / 10% Cash';
    }
    return '65% Stocks / 25% Bonds / 10% Cash';
  }
  if (score > 0) {
    return '60% Stocks / 30% Bonds / 10% Cash';
  }
  if (score > -3) {
    return '50% Stocks / 35% Bonds / 15% Cash';
  }
  if (score > -6) {
    return '30% Stocks / 50% Bonds / 20% Cash';
  }
  return '20% Stocks / 50% Bonds / 30% Cash';
}

export function getSectorFocus(score: number, rsi: number, vix: number): string {
  if (score > 3 && rsi < 70) {
    return 'Growth: Tech, Consumer Disc, Comm';
  }
  if (score > 3) {
    return 'Quality Growth: Large Cap Tech';
  }
  if (score > -3) {
    return 'Balanced: Blend + Quality Dividend';
  }
  if (vix > 30) {
    return 'Defensive: Staples, Healthcare, Utils';
  }
  return 'Value: Financials, Energy, Materials';
}

export function getTimeHorizon(score: number, momentum: number): string {
  if (score > 4 && momentum > 3) {
    return 'Short-term trend (weeks)';
  }
  if (score > 2) {
    return 'Medium-term (months)';
  }
  if (score > -2) {
    return 'Long-term positioning (6-12M)';
  }
  if (score < -4) {
    return 'Multi-year hold (2-4 years)';
  }
  return 'Medium-long term (6-18M)';
}

export function getRiskLevel(
  score: number,
  vix: number,
  rsi: number,
  fearGreed: number,
  athDistance: number
): string {
  let riskScore = 0;

  if (Math.abs(score) > 6) riskScore += 3;
  else if (Math.abs(score) > 3) riskScore += 1;

  if (vix > 30) riskScore += 2;
  else if (vix > 25) riskScore += 1;
  else if (vix < 12) riskScore += 2;

  if (rsi > 75 || rsi < 25) riskScore += 2;
  else if (rsi > 70 || rsi < 30) riskScore += 1;

  if (fearGreed > 80 || fearGreed < 20) riskScore += 2;

  if (score > 3 && athDistance > 98) riskScore += 2;

  if (riskScore >= 8) return 'EXTREME - Reduce exposure';
  if (riskScore >= 6) return 'Very High - Take profits';
  if (riskScore >= 4) return 'High - Hedge positions';
  if (riskScore >= 2) return 'Moderate - Monitor closely';
  return 'Low - Good for positioning';
}

export function getActionableTips(
  score: number,
  vix: number,
  rsi: number,
  fearGreed: number,
  athDistance: number
): string[] {
  const tips: string[] = [];

  if (score > 6) {
    tips.push('💰 Take profits on overweight positions');
    tips.push('🛡️ Increase hedges (puts, inverse ETFs)');
  } else if (score > 3) {
    tips.push('⚖️ Rebalance to target allocation');
    tips.push('📊 Set trailing stops at -8%');
  } else if (score > 0) {
    tips.push('📈 Add to growth positions gradually');
    tips.push('✅ Good time for DCA strategy');
  } else if (score < -3) {
    tips.push('💎 Accumulation zone - quality names');
    tips.push('📅 Think 12+ months time horizon');
  }

  if (vix > 30) {
    tips.push('🌊 High volatility - use limit orders');
  } else if (vix < 13) {
    tips.push('⚠️ Complacency risk - stay alert');
  }

  if (rsi > 75) {
    tips.push('📉 Market overbought - wait pullback');
  } else if (rsi < 30) {
    tips.push('📈 Market oversold - good entry');
  }

  if (athDistance > 98 && score > 3) {
    tips.push('🎯 Near ATH - avoid FOMO buying');
  }

  if (fearGreed > 80) {
    tips.push('😨 Extreme greed - be cautious');
  } else if (fearGreed < 25) {
    tips.push('🤑 Extreme fear - opportunity');
  }

  return tips.slice(0, 4);
}
