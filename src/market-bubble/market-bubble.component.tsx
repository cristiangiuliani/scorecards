import Box from '@mui/material/Box';
import React, { useContext } from 'react';

import { AI_BUBBLE_LABELS } from '../constants/labels';
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

  const currentVix = vixHistory && vixHistory.length > 0
    ? vixHistory[vixHistory.length - 1]
    : 0;

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
      suffix: 'x',
      threshold: '> 65x = Danger',
    },
    {
      label: AI_BUBBLE_LABELS.nasdaqPE,
      weight: 1.0,
      value: nasdaqPE,
      score: nasdaqScore,
      isLoading: isNasdaqPELoading,
      suffix: 'x',
      threshold: '> 38x = Danger',
    },
    {
      label: AI_BUBBLE_LABELS.nvdaNasdaqRatio,
      weight: 0, // Peso 0 perché è solo informativo, non conta nello score
      value: nvdaNasdaqRatio,
      score: 0, // Non contribuisce allo score
      isLoading: isNvidiaPELoading || isNasdaqPELoading,
      suffix: 'x',
      threshold: '< 1.5 = Healthy',
    },
    {
      label: AI_BUBBLE_LABELS.vixPersistence,
      weight: 1.0,
      value: daysAbove30,
      score: vixPersistScore,
      isLoading: isVixHistoryLoading,
      suffix: `/ 5 days > 30 (Current: ${currentVix.toFixed(1)})`,
      threshold: '≥ 3 days = Alert',
    },
  ];

  const BubbleStrategyList: TStrategiesListItem[] = [
    {
      title: '💼 Portfolio Action',
      color: bubbleIndicator.risk === 'HIGH' ? 'error' :
        bubbleIndicator.risk === 'MEDIUM' ? 'warning' : 'success',
      isLoading: isNvidiaPELoading || isNasdaqPELoading || isVixHistoryLoading,
      items: [
        {
          label: 'Risk Level',
          value: `${bubbleIndicator.risk} RISK (${bubbleIndicator.score.toFixed(1)}/3)`,
        },
        {
          label: 'Recommendation',
          value: getPortfolioRecommendation(bubbleIndicator.risk),
        },
      ],
    },
    {
      title: '🏢 Sector Rotation',
      color: bubbleIndicator.risk === 'HIGH' ? 'error' : 'info',
      isLoading: isNvidiaPELoading || isNasdaqPELoading,
      items: [
        {
          label: 'Recommended Sectors',
          value: getSectorRecommendation(bubbleIndicator.risk),
        },
      ],
    },
    {
      title: '⏱️ Timing Strategy',
      color: bubbleIndicator.risk === 'HIGH' ? 'error' :
        bubbleIndicator.risk === 'MEDIUM' ? 'warning' : 'success',
      isLoading: isVixHistoryLoading,
      items: [
        {
          label: 'Action',
          value: getTimingRecommendation(bubbleIndicator.risk),
        },
      ],
    },
    {
      title: '💡 Actionable Tips',
      color: 'info',
      isLoading: isNvidiaPELoading || isNasdaqPELoading || isVixHistoryLoading,
      items: getActionableTips(bubbleIndicator).map((tip, index) => ({
        label: `Tip ${index + 1}`,
        value: tip,
      })),
    },
  ];

  return (
    <>
      <Box>
        <ScoreCardsComponent
          score={displayScore}
          interpretation={interpretation}
          cacheCreatedAt={cacheCreatedAt}
          cacheExpiresAt={cacheExpiresAt}
          isLoading={isNvidiaPELoading && isNasdaqPELoading && isVixHistoryLoading}
          refetchAllData={refetchMarketBubbleData}
        />

        <IndicatorsComponent
          indexList={BubbleIndexList}
        />

        <StrategiesComponent strategiesList={BubbleStrategyList} />
      </Box>
    </>
  );
};

export default MarketBubbleComponent;
