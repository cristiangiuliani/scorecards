import Grid from '@mui/material/Grid';
import React, { useContext } from 'react';

import { BUBBLE_RANGES } from '../constants/config';
import { AI_BUBBLE_LABELS, COMMON_LABELS } from '../constants/labels';
import type { IMarketBubbleContext } from '../interfaces/market-bubble';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type {
  TIndicatorsListItem,
  TStrategiesListItem,
} from '../types/data.type';

import MarketBubbleContext from './market-bubble.context';
import {
  calculateBubbleRisk,
  calculateNasdaqPEScore,
  calculateNvidiaPEScore,
  calculateVixPersistenceScore,
  displayScoreRisk,
} from './utils/bubble-formulas';
import {
  getBubbleInterpretation,
  getPortfolioRecommendation,
  getSectorRecommendation,
  getTimingRecommendation,
  getActionableTips,
} from './utils/bubble-interpretation';

const MarketBubbleComponent: React.FC = () => {
  const {
    nvidiaPE = 0,
    nasdaqPE = 0,
    vixHistory = [],
    cacheCreatedAt,
    cacheExpiresAt,
    isNvidiaPELoading = false,
    isNasdaqPELoading = false,
    isVixHistoryLoading = false,
    refetchMarketBubbleData = () => {},
  } = useContext<IMarketBubbleContext>(MarketBubbleContext);

  const bubbleIndicator = calculateBubbleRisk({
    nvidiaPE,
    nasdaqPE,
    vixHistory,
  });

  const interpretation = getBubbleInterpretation(bubbleIndicator);

  const daysAbove30 = vixHistory && vixHistory.length > 0
    ? vixHistory.slice(-5).filter((v) => v > 30).length
    : 0;

  const displayScore = displayScoreRisk(bubbleIndicator);

  const nvdaNasdaqRatio = nvidiaPE && nasdaqPE ? nvidiaPE / nasdaqPE : 0;
  const nvidiaScore = calculateNvidiaPEScore(nvidiaPE);
  const nasdaqScore = calculateNasdaqPEScore(nasdaqPE);
  const vixPersistScore = calculateVixPersistenceScore(vixHistory);

  const BubbleIndexList: TIndicatorsListItem[] = [
    {
      label: AI_BUBBLE_LABELS.nvidiaPE,
      description: 'AI sector valuation proxy',
      weight: 1.0,
      value: nvidiaPE,
      score: nvidiaScore,
      isLoading: isNvidiaPELoading,
      min: BUBBLE_RANGES.nvidiaPE.min,
      max: BUBBLE_RANGES.nvidiaPE.max,
      minLabel: BUBBLE_RANGES.nvidiaPE.minLabel,
      maxLabel: BUBBLE_RANGES.nvidiaPE.maxLabel,
    },
    {
      label: AI_BUBBLE_LABELS.nasdaqPE,
      description: 'Tech market valuation',
      weight: 1.0,
      value: nasdaqPE,
      score: nasdaqScore,
      isLoading: isNasdaqPELoading,
      min: BUBBLE_RANGES.nasdaqPE.min,
      max: BUBBLE_RANGES.nasdaqPE.max,
      minLabel: BUBBLE_RANGES.nasdaqPE.minLabel,
      maxLabel: BUBBLE_RANGES.nasdaqPE.maxLabel,
    },
    {
      label: AI_BUBBLE_LABELS.nvdaNasdaqRatio,
      description: 'AI vs tech valuation ratio',
      weight: 0,
      value: nvdaNasdaqRatio,
      score: 0,
      isLoading: isNvidiaPELoading || isNasdaqPELoading,
      min: BUBBLE_RANGES.nvdaNasdaqRatio.min,
      max: BUBBLE_RANGES.nvdaNasdaqRatio.max,
      minLabel: BUBBLE_RANGES.nvdaNasdaqRatio.minLabel,
      maxLabel: BUBBLE_RANGES.nvdaNasdaqRatio.maxLabel,
    },
    {
      label: AI_BUBBLE_LABELS.vixPersistence,
      description: 'Sustained market stress',
      weight: 1.0,
      value: daysAbove30,
      score: vixPersistScore,
      isLoading: isVixHistoryLoading,
      min: BUBBLE_RANGES.vixPersistence.min,
      max: BUBBLE_RANGES.vixPersistence.max,
      minLabel: BUBBLE_RANGES.vixPersistence.minLabel,
      maxLabel: BUBBLE_RANGES.vixPersistence.maxLabel,
    },
  ];

  const BubbleStrategyList: TStrategiesListItem[] = [
    {
      title: AI_BUBBLE_LABELS.portfolioAction,
      color: interpretation.color,
      isLoading: isNvidiaPELoading || isNasdaqPELoading || isVixHistoryLoading,
      items: [
        {
          label: COMMON_LABELS.RiskLevel,
          value: `${bubbleIndicator.risk} RISK (${Math.abs(bubbleIndicator.score).toFixed(1)}/10)`,
        },
        {
          label: AI_BUBBLE_LABELS.recommendation,
          value: getPortfolioRecommendation(bubbleIndicator.risk),
        },
      ],
    },
    {
      title: AI_BUBBLE_LABELS.sectorRotation,
      color: interpretation.color,
      isLoading: isNvidiaPELoading || isNasdaqPELoading,
      items: [
        {
          label: AI_BUBBLE_LABELS.recommendedSectors,
          value: getSectorRecommendation(bubbleIndicator.risk),
        },
      ],
    },
    {
      title: AI_BUBBLE_LABELS.timingStrategy,
      color: interpretation.color,
      isLoading: isVixHistoryLoading,
      items: [
        {
          label: AI_BUBBLE_LABELS.action,
          value: getTimingRecommendation(bubbleIndicator.risk),
        },
      ],
    },
    {
      title: AI_BUBBLE_LABELS.actionableTips,
      color: interpretation.color,
      isLoading: isNvidiaPELoading || isNasdaqPELoading || isVixHistoryLoading,
      items: getActionableTips(bubbleIndicator).map((tip, index) => ({
        label: `Tip ${index + 1}`,
        value: tip,
      })),
    },
  ];

  return (
    <>
      <Grid
        container
        spacing={2}
        mb={2}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 6,
        }}
        >
          <ScoreCardsComponent
            score={displayScore}
            min={0}
            max={10}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isNvidiaPELoading && isNasdaqPELoading && isVixHistoryLoading}
            refetchAllData={refetchMarketBubbleData}
            minLabel="Safe"
            maxLabel="Bubble"
            label={AI_BUBBLE_LABELS.OverallScore}
            description="AI sector bubble risk assessment based on NVIDIA and NASDAQ valuations, and market volatility patterns."
            thresholds={[
              'Score < 3: LOW RISK',
              'Score 3-7: MODERATE RISK',
              'Score > 7: HIGH RISK',
              'Score = 10: CRITICAL',
            ]}
          />
        </Grid>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 6,
        }}
        >
          <IndicatorsComponent
            indexList={BubbleIndexList}
          />

        </Grid>
      </Grid>
      <StrategiesComponent strategiesList={BubbleStrategyList} />
    </>
  );
};

export default MarketBubbleComponent;
