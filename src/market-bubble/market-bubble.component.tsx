import Grid from '@mui/material/Grid';
import React, { useContext } from 'react';

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
import { calculateBubbleRisk, displayScoreRisk } from './utils/bubble-formulas';
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
  const nvidiaScore = nvidiaPE > 65 ? 1 : nvidiaPE > 58.5 ? 0.5 : 0;
  const nasdaqScore = nasdaqPE > 38 ? 1 : nasdaqPE > 34.2 ? 0.5 : 0;
  const vixPersistScore = daysAbove30 >= 3 ? 1 : daysAbove30 >= 2 ? 0.5 : 0;

  const BubbleIndexList: TIndicatorsListItem[] = [
    {
      label: AI_BUBBLE_LABELS.nvidiaPE,
      weight: 1.0,
      value: nvidiaPE,
      score: nvidiaScore,
      isLoading: isNvidiaPELoading,
    },
    {
      label: AI_BUBBLE_LABELS.nasdaqPE,
      weight: 1.0,
      value: nasdaqPE,
      score: nasdaqScore,
      isLoading: isNasdaqPELoading,
    },
    {
      label: AI_BUBBLE_LABELS.nvdaNasdaqRatio,
      weight: 0,
      value: nvdaNasdaqRatio,
      score: 0,
      isLoading: isNvidiaPELoading || isNasdaqPELoading,
    },
    {
      label: AI_BUBBLE_LABELS.vixPersistence,
      weight: 1.0,
      value: daysAbove30,
      score: vixPersistScore,
      isLoading: isVixHistoryLoading,

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
          value: `${bubbleIndicator.risk} RISK (${bubbleIndicator.score.toFixed(1)}/3)`,
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
        <Grid size={6}>
          <ScoreCardsComponent
            score={displayScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isNvidiaPELoading && isNasdaqPELoading && isVixHistoryLoading}
            refetchAllData={refetchMarketBubbleData}
          />
        </Grid>
        <Grid size={6}>
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
