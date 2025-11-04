import { Grid } from '@mui/material';
import React, { useContext } from 'react';

import { TREASURY_BONDS_RANGES, TREASURY_BONDS_WEIGHTS } from '../constants/config';
import { TREASURY_BONDS_LABELS } from '../constants/labels';
import type { IMarketTreasuryBondsContext } from '../interfaces/market-treasury-bonds';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type { TIndicatorsListItem, TStrategiesListItem } from '../types/data.type';

import MarketTreasuryBondsContext from './market-treasury-bonds.context';
import {
  calculateBondsScore,
  calculateCreditSpreadsScore,
  calculateInflationScore,
  calculateYield10YScore,
  calculateYield2YScore,
  calculateYield5YScore,
  calculateYieldCurveSlopeScore,
} from './utils/bonds-formulas';
import {
  getActionableTips,
  getBondAllocation,
  getBondsInterpretation,
  getDurationStrategy,
  getMarketPhase,
  getRiskLevel,
  getSectorRecommendation,
  getTimingSignal,
} from './utils/bonds-interpretation';

const MarketTreasuryBondsComponent: React.FC = () => {
  const {
    yield10Y = 0,
    yield5Y = 0,
    yield2Y = 0,
    creditSpreads = 0,
    inflationExpectations = 0,
    cacheCreatedAt,
    cacheExpiresAt,
    isYield10YLoading = false,
    isYield5YLoading = false,
    isYield2YLoading = false,
    isSpreadsLoading = false,
    isInflationLoading = false,
    refetchMarketBondsData = () => {},
  } = useContext<IMarketTreasuryBondsContext>(MarketTreasuryBondsContext);

  // Calculate yield curve slope (10Y - 2Y)
  const yieldCurveSlope = yield10Y - yield2Y;

  // Calculate overall bonds score
  const bondsScore = calculateBondsScore({
    yield10Y,
    yield5Y,
    yield2Y,
    yieldCurveSlope,
    creditSpreads,
    inflationExpectations,
  });

  const interpretation = getBondsInterpretation(bondsScore);

  const BondsIndexList: TIndicatorsListItem[] = [
    {
      label: TREASURY_BONDS_LABELS.Yield10Y,
      description: '10-year US Treasury yield, benchmark for long-term rates. Higher yields (>4.5%) make bonds attractive vs stocks, lower yields (<3%) favor equities. Reflects long-term economic outlook.',
      weight: TREASURY_BONDS_WEIGHTS.yield10Y,
      value: yield10Y,
      score: calculateYield10YScore(yield10Y),
      isLoading: isYield10YLoading,
      decimals: 2,
      min: TREASURY_BONDS_RANGES.yield10Y.min,
      max: TREASURY_BONDS_RANGES.yield10Y.max,
      minLabel: TREASURY_BONDS_RANGES.yield10Y.minLabel,
      maxLabel: TREASURY_BONDS_RANGES.yield10Y.maxLabel,
    },
    {
      label: TREASURY_BONDS_LABELS.Yield5Y,
      description: '5-year Treasury yield, mid-term rate indicator. Used for mortgage pricing and medium-duration bonds. Rising yields signal tightening conditions, falling yields suggest easing ahead.',
      weight: TREASURY_BONDS_WEIGHTS.yield5Y,
      value: yield5Y,
      score: calculateYield5YScore(yield5Y),
      isLoading: isYield5YLoading,
      decimals: 2,
      min: TREASURY_BONDS_RANGES.yield5Y.min,
      max: TREASURY_BONDS_RANGES.yield5Y.max,
      minLabel: TREASURY_BONDS_RANGES.yield5Y.minLabel,
      maxLabel: TREASURY_BONDS_RANGES.yield5Y.maxLabel,
    },
    {
      label: TREASURY_BONDS_LABELS.Yield2Y,
      description: '2-year Treasury yield, sensitive to Fed policy. Closely tracks federal funds rate expectations. Rising 2Y yields indicate expected Fed tightening, falling suggests rate cuts ahead.',
      weight: TREASURY_BONDS_WEIGHTS.yield2Y,
      value: yield2Y,
      score: calculateYield2YScore(yield2Y),
      isLoading: isYield2YLoading,
      decimals: 2,
      min: TREASURY_BONDS_RANGES.yield2Y.min,
      max: TREASURY_BONDS_RANGES.yield2Y.max,
      minLabel: TREASURY_BONDS_RANGES.yield2Y.minLabel,
      maxLabel: TREASURY_BONDS_RANGES.yield2Y.maxLabel,
    },
    {
      label: TREASURY_BONDS_LABELS.YieldCurveSlope,
      description: 'Yield curve slope (10Y - 2Y). Positive slope indicates healthy economy, negative (inverted) historically precedes recessions. Steepening favors long-duration bonds.',
      weight: TREASURY_BONDS_WEIGHTS.yieldCurveSlope,
      value: yieldCurveSlope,
      score: calculateYieldCurveSlopeScore(yieldCurveSlope),
      isLoading: isYield10YLoading || isYield2YLoading,
      decimals: 2,
      min: TREASURY_BONDS_RANGES.yieldCurveSlope.min,
      max: TREASURY_BONDS_RANGES.yieldCurveSlope.max,
      minLabel: TREASURY_BONDS_RANGES.yieldCurveSlope.minLabel,
      maxLabel: TREASURY_BONDS_RANGES.yieldCurveSlope.maxLabel,
    },
    {
      label: TREASURY_BONDS_LABELS.CreditSpreads,
      description: 'Corporate bond spread over Treasuries in basis points. Widening spreads (>200 bps) indicate credit stress and flight to quality. Tight spreads (<100 bps) show investor confidence.',
      weight: TREASURY_BONDS_WEIGHTS.creditSpreads,
      value: creditSpreads,
      score: calculateCreditSpreadsScore(creditSpreads),
      isLoading: isSpreadsLoading,
      decimals: 0,
      min: TREASURY_BONDS_RANGES.creditSpreads.min,
      max: TREASURY_BONDS_RANGES.creditSpreads.max,
      minLabel: TREASURY_BONDS_RANGES.creditSpreads.minLabel,
      maxLabel: TREASURY_BONDS_RANGES.creditSpreads.maxLabel,
    },
    {
      label: TREASURY_BONDS_LABELS.Inflation,
      description: 'Expected inflation rate from market-implied indicators. Higher inflation (>3%) erodes bond returns and favors TIPS. Lower inflation (<2%) benefits nominal bonds.',
      weight: TREASURY_BONDS_WEIGHTS.inflation,
      value: inflationExpectations,
      score: calculateInflationScore(inflationExpectations),
      isLoading: isInflationLoading,
      decimals: 2,
      min: TREASURY_BONDS_RANGES.inflation.min,
      max: TREASURY_BONDS_RANGES.inflation.max,
      minLabel: TREASURY_BONDS_RANGES.inflation.minLabel,
      maxLabel: TREASURY_BONDS_RANGES.inflation.maxLabel,
    },
  ];

  const BondsStrategyList: TStrategiesListItem[] = [
    {
      title: TREASURY_BONDS_LABELS.DurationStrategy,
      color: interpretation.color,
      isLoading: isYield10YLoading || isYield5YLoading || isYield2YLoading,
      items: [
        {
          label: 'Duration Positioning',
          value: getDurationStrategy(bondsScore, yieldCurveSlope),
        },
        {
          label: 'Recommended Allocation',
          value: getBondAllocation(bondsScore),
        },
      ],
    },
    {
      title: TREASURY_BONDS_LABELS.AllocationStrategy,
      color: interpretation.color,
      isLoading: isYield10YLoading || isYield5YLoading || isInflationLoading,
      items: [
        {
          label: 'Market Phase',
          value: getMarketPhase(bondsScore, yieldCurveSlope, creditSpreads),
        },
        {
          label: 'Sector Focus',
          value: getSectorRecommendation(bondsScore, yieldCurveSlope, inflationExpectations),
        },
      ],
    },
    {
      title: TREASURY_BONDS_LABELS.RiskAssessment,
      color: interpretation.color,
      isLoading: isYield10YLoading || isSpreadsLoading,
      items: [
        {
          label: 'Risk Level',
          value: getRiskLevel(bondsScore, yieldCurveSlope, creditSpreads),
        },
        {
          label: 'Timing Signal',
          value: getTimingSignal(bondsScore),
        },
      ],
    },
    {
      title: TREASURY_BONDS_LABELS.ActionItems,
      color: interpretation.color,
      isLoading:
        isYield10YLoading || isYield5YLoading || isYield2YLoading || isSpreadsLoading,
      items: getActionableTips(
        bondsScore,
        yieldCurveSlope,
        creditSpreads,
        inflationExpectations
      ).map((tip) => ({
        value: tip,
      })),
    },
  ];

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
        >
          <ScoreCardsComponent
            score={bondsScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isYield10YLoading && isYield5YLoading && isYield2YLoading}
            refetchAllData={refetchMarketBondsData}
            minLabel="Sell"
            maxLabel="Buy"
            label={TREASURY_BONDS_LABELS.OverallScore}
            description="Overall treasury bonds sentiment based on yield curves, spreads, and economic indicators"
          />
        </Grid>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 8,
        }}
        >
          <IndicatorsComponent indexList={BondsIndexList} />
        </Grid>
      </Grid>
      <StrategiesComponent strategiesList={BondsStrategyList} />
    </>
  );
};

export default MarketTreasuryBondsComponent;
