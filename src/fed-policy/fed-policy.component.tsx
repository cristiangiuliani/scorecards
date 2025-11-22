import Grid from '@mui/material/Grid';
import React, {
  useContext,
} from 'react';

import { FED_POLICY_WEIGHTS, FED_POLICY_RANGES } from '../constants/config';
import { FED_POLICY_LABELS } from '../constants/labels';
import type { IFedPolicyContext } from '../interfaces/fed-policy';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type {
  TIndicatorsListItem,
  TStrategiesListItem,
} from '../types/data.type';

import FedPolicyContext from './fed-policy.context';
import {
  calculateCpiScore,
  calculateCorePceScore,
  calculateFedFundsScore,
  calculateFedPolicyScore,
  calculateUnemploymentScore,
  calculateWageGrowthScore,
} from './utils/fed-formulas';
import {
  getFedPolicyInterpretation,
  getInflationPressure,
  getKeyDriver,
  getLaborMarketStatus,
  getMarketImplications,
  getNextFedMove,
  getRateDirection,
} from './utils/fed-interpretation';

const FedPolicyComponent: React.FC = () => {
  const {
    cpiInflation = 0,
    corePce = 0,
    unemploymentRate = 0,
    averageHourlyEarnings = 0,
    federalFundsRate = 0,
    cacheCreatedAt,
    cacheExpiresAt,
    isCpiLoading,
    isCorePceLoading,
    isUnemploymentLoading,
    isEarningsLoading,
    isFedFundsLoading,
    refetchFedPolicyData = () => {},
  } = useContext<IFedPolicyContext>(FedPolicyContext);

  const fedPolicyScore = calculateFedPolicyScore({
    cpiInflation,
    corePce,
    unemploymentRate,
    averageHourlyEarnings,
    federalFundsRate,
  });

  const fedIndexList: TIndicatorsListItem[] = [
    {
      label: FED_POLICY_LABELS.CpiInflation,
      description: FED_POLICY_LABELS.CpiInflationDescription,
      weight: FED_POLICY_WEIGHTS.cpiInflation,
      value: cpiInflation,
      score: calculateCpiScore(cpiInflation),
      isLoading: isCpiLoading,
      min: FED_POLICY_RANGES.cpiInflation.min,
      max: FED_POLICY_RANGES.cpiInflation.max,
      minLabel: FED_POLICY_RANGES.cpiInflation.minLabel,
      maxLabel: FED_POLICY_RANGES.cpiInflation.maxLabel,
      suffix: '%',
    },
    {
      label: FED_POLICY_LABELS.CorePce,
      description: FED_POLICY_LABELS.CorePceDescription,
      weight: FED_POLICY_WEIGHTS.corePce,
      value: corePce,
      score: calculateCorePceScore(corePce),
      isLoading: isCorePceLoading,
      min: FED_POLICY_RANGES.corePce.min,
      max: FED_POLICY_RANGES.corePce.max,
      minLabel: FED_POLICY_RANGES.corePce.minLabel,
      maxLabel: FED_POLICY_RANGES.corePce.maxLabel,
      suffix: '%',
    },
    {
      label: FED_POLICY_LABELS.UnemploymentRate,
      description: FED_POLICY_LABELS.UnemploymentRateDescription,
      weight: FED_POLICY_WEIGHTS.unemploymentRate,
      value: unemploymentRate,
      score: calculateUnemploymentScore(unemploymentRate),
      isLoading: isUnemploymentLoading,
      min: FED_POLICY_RANGES.unemploymentRate.min,
      max: FED_POLICY_RANGES.unemploymentRate.max,
      minLabel: FED_POLICY_RANGES.unemploymentRate.minLabel,
      maxLabel: FED_POLICY_RANGES.unemploymentRate.maxLabel,
      suffix: '%',
    },
    {
      label: FED_POLICY_LABELS.AverageHourlyEarnings,
      description: FED_POLICY_LABELS.AverageHourlyEarningsDescription,
      weight: FED_POLICY_WEIGHTS.averageHourlyEarnings,
      value: averageHourlyEarnings,
      score: calculateWageGrowthScore(averageHourlyEarnings),
      isLoading: isEarningsLoading,
      min: FED_POLICY_RANGES.averageHourlyEarnings.min,
      max: FED_POLICY_RANGES.averageHourlyEarnings.max,
      minLabel: FED_POLICY_RANGES.averageHourlyEarnings.minLabel,
      maxLabel: FED_POLICY_RANGES.averageHourlyEarnings.maxLabel,
      suffix: '%',
    },
    {
      label: FED_POLICY_LABELS.FederalFundsRate,
      description: FED_POLICY_LABELS.FederalFundsRateDescription,
      weight: FED_POLICY_WEIGHTS.federalFundsRate,
      value: federalFundsRate,
      score: calculateFedFundsScore(federalFundsRate),
      isLoading: isFedFundsLoading,
      min: FED_POLICY_RANGES.federalFundsRate.min,
      max: FED_POLICY_RANGES.federalFundsRate.max,
      minLabel: FED_POLICY_RANGES.federalFundsRate.minLabel,
      maxLabel: FED_POLICY_RANGES.federalFundsRate.maxLabel,
    },
  ];

  const interpretation = getFedPolicyInterpretation(fedPolicyScore);

  const getFedStrategies = (): TStrategiesListItem[] => {
    return [
      {
        title: FED_POLICY_LABELS.PolicyStance,
        color: interpretation.color,
        isLoading: isCpiLoading || isCorePceLoading,
        items: [
          {
            label: FED_POLICY_LABELS.NextMoveExpected,
            value: getNextFedMove(fedPolicyScore),
          },
          {
            label: FED_POLICY_LABELS.RateDirection,
            value: getRateDirection(fedPolicyScore),
          },
        ],
      },
      {
        title: FED_POLICY_LABELS.InflationPressure,
        color: interpretation.color,
        isLoading: isCpiLoading || isCorePceLoading,
        items: [
          {
            label: 'Status',
            value: getInflationPressure(cpiInflation, corePce),
          },
          {
            label: 'Avg Inflation',
            value: `${((cpiInflation + corePce) / 2).toFixed(1)}%`,
          },
        ],
      },
      {
        title: FED_POLICY_LABELS.LaborMarket,
        color: interpretation.color,
        isLoading: isUnemploymentLoading || isEarningsLoading,
        items: [
          {
            label: 'Status',
            value: getLaborMarketStatus(unemploymentRate, averageHourlyEarnings),
          },
          {
            label: FED_POLICY_LABELS.KeyMetric,
            value: getKeyDriver(cpiInflation, corePce, unemploymentRate, averageHourlyEarnings),
          },
        ],
      },
      {
        title: FED_POLICY_LABELS.ActionItems,
        color: interpretation.color,
        isLoading: isCpiLoading || isCorePceLoading || isUnemploymentLoading,
        items: getMarketImplications(
          fedPolicyScore,
          cpiInflation,
          unemploymentRate
        ).map((tip) => ({
          value: tip,
        })),
      },
    ];
  };

  const isLoading = isCpiLoading || isCorePceLoading || isUnemploymentLoading ||
                     isEarningsLoading || isFedFundsLoading;

  return (
    <>
      <Grid
        container
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
        >
          <ScoreCardsComponent
            score={fedPolicyScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isLoading}
            refetchAllData={refetchFedPolicyData}
            minLabel="Dovish"
            maxLabel="Hawkish"
            label={FED_POLICY_LABELS.OverallScore}
            description={FED_POLICY_LABELS.Description}
            thresholds={
              [`Score ≥ 6: ${FED_POLICY_LABELS.Hawkish}`,
                `Score 2 to 6: ${FED_POLICY_LABELS.ModerateHawkish}`,
                `Score -2 to 2: ${FED_POLICY_LABELS.Neutral}`,
                `Score -6 to -2: ${FED_POLICY_LABELS.ModerateDovish}`,
                `Score < -6: ${FED_POLICY_LABELS.Dovish}`]
            }
          />
        </Grid>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 8,
        }}
        >
          <IndicatorsComponent indexList={fedIndexList} />
        </Grid>
      </Grid>
      <StrategiesComponent strategiesList={getFedStrategies()} />
    </>
  );
};

export default FedPolicyComponent;
