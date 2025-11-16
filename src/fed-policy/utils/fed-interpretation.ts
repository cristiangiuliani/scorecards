import { FED_POLICY_LABELS } from '../../constants/labels';
import type { TInterpretation } from '../../types/data.type';

// Get Fed Policy interpretation based on score
export const getFedPolicyInterpretation = (score: number): TInterpretation => {
  if (score >= 6) {
    return {
      text: FED_POLICY_LABELS.Hawkish,
      color: 'error',
      severity: 'error',
    };
  }
  if (score >= 2) {
    return {
      text: FED_POLICY_LABELS.ModerateHawkish,
      color: 'default',
      severity: 'warning',
    };
  }
  if (score >= -2) {
    return {
      text: FED_POLICY_LABELS.Neutral,
      color: 'default',
      severity: 'info',
    };
  }
  if (score >= -6) {
    return {
      text: FED_POLICY_LABELS.ModerateDovish,
      color: 'default',
      severity: 'warning',
    };
  }
  return {
    text: FED_POLICY_LABELS.Dovish,
    color: 'success',
    severity: 'success',
  };
};

// Get expected next Fed move
export const getNextFedMove = (
  score: number
): string => {
  if (score >= 4) {
    return 'Rate hike likely within 3-6 months';
  }
  if (score >= 1) {
    return 'Rates on hold, no cuts expected soon';
  }
  if (score >= -1) {
    return 'Data-dependent, watching inflation closely';
  }
  if (score >= -4) {
    return 'First rate cut expected within 6 months';
  }
  return 'Multiple rate cuts likely in next 12 months';
};

// Get inflation pressure status
export const getInflationPressure = (cpiInflation: number, corePce: number): string => {
  const avgInflation = (cpiInflation + corePce) / 2;

  if (avgInflation >= 3.5) return 'High - Well above Fed target';
  if (avgInflation >= 2.5) return 'Moderate - Above target';
  if (avgInflation >= 1.5) return 'Low - Near target';
  return 'Very Low - Below target';
};

// Get labor market status
export const getLaborMarketStatus = (
  unemploymentRate: number,
  wageGrowth: number
): string => {
  if (unemploymentRate <= 3.5 && wageGrowth >= 4) {
    return 'Very Tight - Inflationary pressure';
  }
  if (unemploymentRate <= 4 && wageGrowth >= 3.5) {
    return 'Tight - Supporting inflation';
  }
  if (unemploymentRate <= 4.5 && wageGrowth >= 3) {
    return 'Balanced - Near full employment';
  }
  if (unemploymentRate <= 5.5) {
    return 'Softening - Easing pressure';
  }
  return 'Weak - Recessionary concerns';
};

// Get rate direction expectation
export const getRateDirection = (score: number): string => {
  if (score >= 4) return '📈 Higher (Hawkish)';
  if (score >= 1) return '➡️ On Hold (Restrictive)';
  if (score >= -1) return '⏸️ Pause (Neutral)';
  if (score >= -4) return '📉 Lower Soon (Dovish)';
  return '📉📉 Much Lower (Very Dovish)';
};

// Get time horizon for policy changes
export const getPolicyTimeHorizon = (score: number): string => {
  if (Math.abs(score) >= 6) return 'Immediate (0-3 months)';
  if (Math.abs(score) >= 3) return 'Near-term (3-6 months)';
  if (Math.abs(score) >= 1) return 'Medium-term (6-12 months)';
  return 'Long-term (12+ months)';
};

// Get market implications
export const getMarketImplications = (
  score: number,
  cpiInflation: number,
  unemploymentRate: number
): string[] => {
  const implications: string[] = [];

  if (score >= 4) {
    implications.push('🔴 Risk assets under pressure from rate hikes');
    implications.push('💵 Strong dollar likely to continue');
    implications.push('📊 Value stocks may outperform growth');
  } else if (score >= 1) {
    implications.push('🟡 Volatility likely as markets await clarity');
    implications.push('💼 Quality stocks preferred in this environment');
    implications.push('📈 Short-term bonds attractive vs long-term');
  } else if (score >= -1) {
    implications.push('⚖️ Balanced portfolio approach recommended');
    implications.push('📊 Both growth and value can perform');
    implications.push('🔄 Monitor data for directional shift');
  } else if (score >= -4) {
    implications.push('🟢 Growth stocks poised to benefit from cuts');
    implications.push('💹 Long-duration bonds becoming attractive');
    implications.push('🏠 Rate-sensitive sectors (real estate) to rally');
  } else {
    implications.push('🚀 Risk assets rally on aggressive easing');
    implications.push('💰 High-growth sectors major beneficiaries');
    implications.push('⚠️ Watch for recession risks despite cuts');
  }

  // Add specific warnings
  if (cpiInflation >= 4) {
    implications.push('⚠️ Persistent inflation remains key risk');
  }
  if (unemploymentRate >= 5) {
    implications.push('⚠️ Rising unemployment signals economic stress');
  }

  return implications;
};

// Get key driver of Fed policy
export const getKeyDriver = (
  cpiInflation: number,
  corePce: number,
  unemploymentRate: number,
  wageGrowth: number
): string => {
  const avgInflation = (cpiInflation + corePce) / 2;

  if (avgInflation >= 3.5) return `Inflation: ${avgInflation.toFixed(1)}%`;
  if (unemploymentRate >= 5) return `Unemployment: ${unemploymentRate.toFixed(1)}%`;
  if (wageGrowth >= 4.5) return `Wage Growth: ${wageGrowth.toFixed(1)}%`;
  if (corePce >= 2.5) return `Core PCE: ${corePce.toFixed(1)}%`;
  return 'Balanced Metrics';
};
