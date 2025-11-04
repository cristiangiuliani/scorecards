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
  calculateFearGreedScore,
  calculateNasdaqPEScore,
  calculateNvdaNasdaqRatioScore,
  calculateNvidiaPEScore,
  calculateRsiScore,
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
    fearGreed = 0,
    rsiSP500 = 0,
    cacheCreatedAt,
    cacheExpiresAt,
    isNvidiaPELoading = false,
    isNasdaqPELoading = false,
    isVixHistoryLoading = false,
    isFearGreedLoading = false,
    isRsiLoading = false,
    refetchMarketBubbleData = () => {},
  } = useContext<IMarketBubbleContext>(MarketBubbleContext);

  const bubbleIndicator = calculateBubbleRisk({
    nvidiaPE,
    nasdaqPE,
    vixHistory,
    fearGreed,
    rsiSP500,
  });

  const interpretation = getBubbleInterpretation(bubbleIndicator);

  const daysAbove30 = vixHistory && vixHistory.length > 0
    ? vixHistory.slice(-5).filter((v) => v > 30).length
    : 0;

  const displayScore = displayScoreRisk(bubbleIndicator);

  const nvdaNasdaqRatio = nvidiaPE && nasdaqPE ? nvidiaPE / nasdaqPE : 0;
  const nvidiaScore = calculateNvidiaPEScore(nvidiaPE);
  const nasdaqScore = calculateNasdaqPEScore(nasdaqPE);
  const nvdaNasdaqRatioScore = calculateNvdaNasdaqRatioScore(nvidiaPE, nasdaqPE);
  const vixPersistScore = calculateVixPersistenceScore(vixHistory);
  const fearGreedScore = calculateFearGreedScore(fearGreed);
  const rsiScore = calculateRsiScore(rsiSP500);

  const BubbleIndexList: TIndicatorsListItem[] = [
    {
      label: AI_BUBBLE_LABELS.nvidiaPE,
      description: 'NVIDIA Price-to-Earnings ratio as AI sector valuation proxy. Historical avg ~40-60. Values above 80 indicate expensive valuations and potential bubble risk in AI stocks.',
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
      description: 'NASDAQ 100 Price-to-Earnings ratio measuring tech sector valuation. Historical avg ~25-30. Values above 35 suggest stretched valuations and elevated market risk.',
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
      description: 'NVIDIA PE / NASDAQ PE ratio showing AI sector premium over broader tech. Ratio above 2.0 indicates AI stocks trading at significant premium, suggesting sector-specific bubble risk.',
      weight: 1.0,
      value: nvdaNasdaqRatio,
      score: nvdaNasdaqRatioScore,
      decimals: 2,
      isLoading: isNvidiaPELoading || isNasdaqPELoading,
      min: BUBBLE_RANGES.nvdaNasdaqRatio.min,
      max: BUBBLE_RANGES.nvdaNasdaqRatio.max,
      minLabel: BUBBLE_RANGES.nvdaNasdaqRatio.minLabel,
      maxLabel: BUBBLE_RANGES.nvdaNasdaqRatio.maxLabel,
    },
    {
      label: AI_BUBBLE_LABELS.vixPersistence,
      description: 'Number of days VIX stayed above 30 (high fear) in the last 5 days. Sustained high volatility signals market stress, potential correction or bubble deflation phase.',
      weight: 1.0,
      value: daysAbove30,
      score: vixPersistScore,
      isLoading: isVixHistoryLoading,
      min: BUBBLE_RANGES.vixPersistence.min,
      max: BUBBLE_RANGES.vixPersistence.max,
      minLabel: BUBBLE_RANGES.vixPersistence.minLabel,
      maxLabel: BUBBLE_RANGES.vixPersistence.maxLabel,
    },
    {
      label: AI_BUBBLE_LABELS.fearGreed,
      description: 'Market sentiment combining volatility, momentum, and put/call ratios. Extreme Greed (>75) combined with high valuations suggests euphoric phase and bubble risk.',
      weight: 1.0,
      value: fearGreed,
      score: fearGreedScore,
      isLoading: isFearGreedLoading,
      min: BUBBLE_RANGES.fearGreed.min,
      max: BUBBLE_RANGES.fearGreed.max,
      minLabel: BUBBLE_RANGES.fearGreed.minLabel,
      maxLabel: BUBBLE_RANGES.fearGreed.maxLabel,
    },
    {
      label: AI_BUBBLE_LABELS.rsiSP500,
      description: 'S&P 500 Relative Strength Index (14-day). Values above 70 indicate overbought conditions. Combined with elevated valuations, suggests increased probability of market correction.',
      weight: 1.0,
      value: rsiSP500,
      score: rsiScore,
      isLoading: isRsiLoading,
      min: BUBBLE_RANGES.rsi.min,
      max: BUBBLE_RANGES.rsi.max,
      minLabel: BUBBLE_RANGES.rsi.minLabel,
      maxLabel: BUBBLE_RANGES.rsi.maxLabel,
    },
  ];

  const BubbleStrategyList: TStrategiesListItem[] = [
    {
      title: AI_BUBBLE_LABELS.portfolioAction,
      color: interpretation.color,
      isLoading: isNvidiaPELoading || isNasdaqPELoading || isVixHistoryLoading || isFearGreedLoading || isRsiLoading,
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
      isLoading: isNvidiaPELoading || isNasdaqPELoading || isFearGreedLoading || isRsiLoading,
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
      isLoading: isVixHistoryLoading || isFearGreedLoading || isRsiLoading,
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
      isLoading: isNvidiaPELoading || isNasdaqPELoading || isVixHistoryLoading || isFearGreedLoading || isRsiLoading,
      items: getActionableTips(bubbleIndicator).map((tip) => ({
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
          md: 4,
        }}
        >
          <ScoreCardsComponent
            score={displayScore}
            min={0}
            max={10}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isNvidiaPELoading && isNasdaqPELoading && isVixHistoryLoading && isFearGreedLoading && isRsiLoading}
            refetchAllData={refetchMarketBubbleData}
            minLabel="Safe"
            maxLabel="Bubble"
            label={AI_BUBBLE_LABELS.OverallScore}
            description="AI sector bubble risk assessment based on tech valuations (NVIDIA, NASDAQ), market sentiment (Fear & Greed, RSI), and volatility patterns (VIX)."
            thresholds={[
              'Score < 4: LOW RISK',
              'Score 4-9: MODERATE RISK',
              'Score > 9: HIGH RISK',
              'Score = 12+: CRITICAL',
            ]}
          />
        </Grid>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 8,
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
