import { COMMON_LABELS } from '../../constants/labels';
import type { TInterpretation } from '../../types/data.type';

export const getCapitalFlowsInterpretation = (score: number): TInterpretation => {
  if (score > 7)
    return {
      text: COMMON_LABELS.StrongInflows,
      color: 'success',
      severity: 'success',
    };
  if (score > 3)
    return {
      text: COMMON_LABELS.Accumulation,
      color: 'success',
      severity: 'info',
    };
  if (score > -3)
    return {
      text: COMMON_LABELS.Neutral,
      color: 'info',
      severity: 'info',
    };
  if (score > -7)
    return {
      text: COMMON_LABELS.Outflows,
      color: 'warning',
      severity: 'warning',
    };
  return {
    text: COMMON_LABELS.FlightToSafety,
    color: 'error',
    severity: 'error',
  };
};

export function getMarketSentimentPhase(score: number): string {
  if (score > 7) {
    return 'Peak Liquidity - Investors aggressively deploying capital into risk assets';
  }
  if (score > 3) {
    return 'Risk-On Environment - Capital rotating from safe havens into growth assets';
  }
  if (score > 0) {
    return 'Early Accumulation - Smart money starting to position for upside';
  }
  if (score > -3) {
    return 'Neutral/Wait-and-See - Capital on sidelines, awaiting clear signals';
  }
  if (score > -7) {
    return 'Risk-Off Mode - Money flowing out of risk assets into safe havens';
  }
  return 'Crisis Mode - Flight to safety, extreme risk aversion';
}

export function getLiquidityConditions(
  fedScore: number,
  m2Score: number,
  dollarScore: number
): string {
  const avgScore = (fedScore + m2Score + dollarScore) / 3;

  if (avgScore > 2) {
    return 'Abundant Liquidity - Central bank easing, dollar weak, money supply growing';
  }
  if (avgScore > 0) {
    return 'Adequate Liquidity - Stable monetary conditions, supportive for markets';
  }
  if (avgScore > -2) {
    return 'Tightening Conditions - Central banks reducing liquidity, caution advised';
  }
  return 'Liquidity Crunch - Severe monetary tightening, high risk environment';
}

export function getRiskAppetiteLevel(
  hySpreadScore: number,
  treasury10YScore: number,
  stablecoinScore: number
): string {
  const avgScore = (hySpreadScore + treasury10YScore + stablecoinScore) / 3;

  if (avgScore > 2) {
    return 'Extreme Risk Appetite - Investors chasing yields, selling safe havens, deploying cash';
  }
  if (avgScore > 0) {
    return 'Healthy Risk Appetite - Balanced flows, measured optimism';
  }
  if (avgScore > -2) {
    return 'Declining Risk Appetite - Investors becoming cautious, buying safe havens';
  }
  return 'Risk Aversion - Panic selling of risk assets, flight to safety';
}

export function getActionableTips(
  score: number,
  fedScore: number,
  stablecoinScore: number,
  cryptoMcapScore: number
): string[] {
  const tips: string[] = [];

  // Overall positioning based on score
  if (score > 6) {
    tips.push('Deploy capital: Strong inflows signal bull market ahead');
    tips.push('Increase exposure: Add to risk assets (stocks, crypto, growth)');
  } else if (score > 3) {
    tips.push('Build positions: Good time to accumulate quality assets');
    tips.push('Stay invested: Capital flows support continued upside');
  } else if (score > 0) {
    tips.push('Start accumulating: Early signs of capital rotation into risk');
    tips.push('DCA strategy: Scale into positions gradually');
  } else if (score < -3) {
    tips.push('Reduce risk exposure: Capital flowing to safe havens');
    tips.push('Preserve capital: Shift to defensive assets (bonds, gold, cash)');
  } else {
    tips.push('Wait for clarity: Neutral flows suggest range-bound markets');
    tips.push('Stay patient: No strong directional signals yet');
  }

  // Fed/Liquidity specific tips
  if (fedScore >= 2) {
    tips.push('Fed expanding balance sheet: QE supporting risk assets');
  } else if (fedScore <= -2) {
    tips.push('Fed in QT mode: Liquidity headwind for risk assets');
  }

  // Stablecoin specific tips
  if (stablecoinScore >= 3) {
    tips.push('High stablecoin reserves: Significant dry powder ready for crypto deployment');
  } else if (stablecoinScore <= -1) {
    tips.push('Low stablecoin levels: Most capital already deployed in crypto');
  }

  // Crypto market cap specific tips
  if (cryptoMcapScore >= 3) {
    tips.push('Strong crypto inflows: Major capital entering the space');
  } else if (cryptoMcapScore <= -3) {
    tips.push('Crypto capital flight: Money leaving for safer assets');
  }

  return tips.slice(0, 6); // Max 6 tips
}

export function getAssetAllocationRecommendation(score: number): string {
  if (score > 6) {
    return '70% Risk Assets (Stocks/Crypto) / 20% Balanced / 10% Cash';
  }
  if (score > 3) {
    return '60% Risk Assets / 30% Balanced / 10% Cash';
  }
  if (score > 0) {
    return '50% Risk Assets / 30% Balanced / 20% Cash';
  }
  if (score > -3) {
    return '40% Risk Assets / 30% Balanced / 30% Cash';
  }
  if (score > -6) {
    return '30% Risk Assets / 30% Defensive / 40% Cash & Bonds';
  }
  return '20% Risk Assets / 20% Defensive / 60% Cash & Bonds & Gold';
}

export function getTimeHorizon(score: number): string {
  if (score > 5) {
    return 'Short to Medium-term (3-12 months) - Deploy capital now for upcoming bull';
  }
  if (score > 2) {
    return 'Medium-term (6-18 months) - Build positions for next cycle';
  }
  if (score > -2) {
    return 'Long-term (12-24 months) - Patient accumulation period';
  }
  return 'Very long-term (2+ years) - Wait for major trend reversal';
}
