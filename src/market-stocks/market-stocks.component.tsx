import { Grid } from '@mui/material';
import React, { useContext } from 'react';

import { STOCKS_WEIGHTS, STOCKS_RANGES } from '../constants/config';
import { STOCKS_LABELS } from '../constants/labels';
import type { IMarketStocksContext } from '../interfaces/market-stocks';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type {
  TIndicatorsListItem,
  TStrategiesListItem,
} from '../types/data.type';

import MarketStocksContext from './market-stocks.context';
import {
  calculateAthDistanceScore,
  calculateEurUsdScore,
  calculateFearGreedScore,
  calculateMomentumScore,
  calculateRsiScore,
  calculateStocksScore,
  calculateVixScore,
} from './utils/stocks-formulas';
import {
  getActionableTips, getMarketPhase, getPortfolioAllocation, getRiskLevel, getSectorFocus, getStockInterpretation, getTimeHorizon,
} from './utils/stocks-interpretation';

const MarketStocksComponent: React.FC = () => {
  const {
    vix = 0,
    rsiSP500 = 0,
    eurUsd = 0,
    fearGreed = 0,
    sp500Price = 0,
    sp500ATH = 0,
    sp500Prices = [],
    sp500Volumes = [],
    cacheCreatedAt,
    cacheExpiresAt,
    isEurUsdLoading = false,
    isFearGreedLoading = false,
    isRsiLoading = false,
    isSp500Loading = false,
    isVixLoading = false,
    refetchMarketStocksData = () => {},
  } = useContext<IMarketStocksContext>(MarketStocksContext);

  const athDistance = sp500Price && sp500ATH
    ? (sp500Price / sp500ATH) * 100
    : 0;

  const momentum7d = sp500Prices && sp500Prices.length >= 8
    ? ((sp500Prices[sp500Prices.length - 1] - sp500Prices[sp500Prices.length - 8])
       / sp500Prices[sp500Prices.length - 8]) * 100
    : 0;

  const stocksScore = calculateStocksScore({
    vix,
    rsiSP500,
    eurUsd,
    fearGreed,
    sp500Price,
    sp500ATH,
    sp500Prices,
    sp500Volumes,
  });

  const interpretation = getStockInterpretation(stocksScore);

  const StocksIndexList: TIndicatorsListItem[] = [
    {
      label: STOCKS_LABELS.Vix,
      description: 'CBOE Volatility Index measuring market fear and uncertainty. Values below 15 indicate calm markets, 15-25 show normal volatility, above 30 signals high stress and potential market corrections.',
      weight: STOCKS_WEIGHTS.vix,
      value: vix,
      score: calculateVixScore(vix),
      isLoading: isVixLoading,
      min: STOCKS_RANGES.vix.min,
      max: STOCKS_RANGES.vix.max,
      minLabel: STOCKS_RANGES.vix.minLabel,
      maxLabel: STOCKS_RANGES.vix.maxLabel,
    },
    {
      label: STOCKS_LABELS.RsiSP500,
      description: 'S&P 500 Relative Strength Index (14-day) measuring momentum. Above 70 indicates overbought conditions (potential pullback), below 30 shows oversold (potential rebound opportunity).',
      weight: STOCKS_WEIGHTS.rsi,
      value: rsiSP500,
      score: calculateRsiScore(rsiSP500),
      isLoading: isRsiLoading,
      min: STOCKS_RANGES.rsi.min,
      max: STOCKS_RANGES.rsi.max,
      minLabel: STOCKS_RANGES.rsi.minLabel,
      maxLabel: STOCKS_RANGES.rsi.maxLabel,
    },
    {
      label: STOCKS_LABELS.EurUsd,
      description: 'EUR/USD exchange rate indicating relative strength between Eurozone and US economies. Higher values favor European stocks, lower values benefit US exporters and dollar-denominated assets.',
      weight: STOCKS_WEIGHTS.eurUsd,
      value: eurUsd,
      score: calculateEurUsdScore(eurUsd),
      decimals: 2,
      isLoading: isEurUsdLoading,
      min: STOCKS_RANGES.eurUsd.min,
      max: STOCKS_RANGES.eurUsd.max,
      minLabel: STOCKS_RANGES.eurUsd.minLabel,
      maxLabel: STOCKS_RANGES.eurUsd.maxLabel,
    },
    {
      label: STOCKS_LABELS.FearGreed,
      description: 'CNN Fear & Greed Index combining market momentum, volatility, put/call ratios, and breadth. Extreme Fear (<25) often signals buying opportunities, Extreme Greed (>75) suggests caution.',
      weight: STOCKS_WEIGHTS.fearGreed,
      value: fearGreed,
      score: calculateFearGreedScore(fearGreed),
      isLoading: isFearGreedLoading,
      min: STOCKS_RANGES.fearGreed.min,
      max: STOCKS_RANGES.fearGreed.max,
      minLabel: STOCKS_RANGES.fearGreed.minLabel,
      maxLabel: STOCKS_RANGES.fearGreed.maxLabel,
    },
    {
      label: STOCKS_LABELS.AthDistance,
      description: 'S&P 500 distance from all-time high. Values above 95% indicate near peak levels (elevated risk), while lower values suggest better risk/reward ratio and accumulation opportunities.',
      weight: STOCKS_WEIGHTS.athDistance,
      value: athDistance,
      score: calculateAthDistanceScore(sp500Price, sp500ATH),
      isLoading: isSp500Loading,
      min: STOCKS_RANGES.athDistance.min,
      max: STOCKS_RANGES.athDistance.max,
      minLabel: STOCKS_RANGES.athDistance.minLabel,
      maxLabel: STOCKS_RANGES.athDistance.maxLabel,
    },
    {
      label: STOCKS_LABELS.Momentum7D,
      description: 'S&P 500 7-day momentum measuring short-term trend strength. Positive values indicate bullish momentum, negative values show bearish pressure. Helps identify potential trend changes.',
      weight: STOCKS_WEIGHTS.momentum,
      value: momentum7d,
      score: calculateMomentumScore(sp500Prices),
      isLoading: isSp500Loading,
      min: STOCKS_RANGES.momentum.min,
      max: STOCKS_RANGES.momentum.max,
      minLabel: STOCKS_RANGES.momentum.minLabel,
      maxLabel: STOCKS_RANGES.momentum.maxLabel,
    },
  ];

  const StocksStrategyList: TStrategiesListItem[] = [
    {
      title: STOCKS_LABELS.PortfolioStrategy,
      color: interpretation.color,
      isLoading: isSp500Loading || isRsiLoading || isVixLoading || isFearGreedLoading,
      items: [
        {
          label: STOCKS_LABELS.MarketPhase,
          value: getMarketPhase(stocksScore, athDistance, vix),
        },
        {
          label: STOCKS_LABELS.TimeHorizon,
          value: getTimeHorizon(stocksScore, momentum7d),
        },
        {
          label: STOCKS_LABELS.Allocation,
          value: getPortfolioAllocation(stocksScore, vix),
        },
      ],
    },
    {
      title: STOCKS_LABELS.SectorFocus,
      color: interpretation.color,
      isLoading: isRsiLoading || isVixLoading || isFearGreedLoading,
      items: [
        {
          label: STOCKS_LABELS.RecommendedSectors,
          value: getSectorFocus(stocksScore, rsiSP500, vix),
        },
        {
          label: STOCKS_LABELS.KeyMetric,
          value: athDistance > 95
            ? `S&P500: ${athDistance.toFixed(1)}% of ATH`
            : `VIX: ${vix?.toFixed(1)}`,
        },
      ],
    },
    {
      title: STOCKS_LABELS.RiskManagement,
      color: interpretation.color,
      isLoading: isVixLoading || isRsiLoading || isFearGreedLoading,
      items: [
        {
          label: STOCKS_LABELS.RiskLevel,
          value: getRiskLevel(stocksScore, vix, rsiSP500, fearGreed, athDistance),
        },
      ],
    },
    {
      title: STOCKS_LABELS.ActionItems,
      color: interpretation.color,
      isLoading: isVixLoading || isRsiLoading || isFearGreedLoading,
      items: getActionableTips(
        stocksScore,
        vix,
        rsiSP500,
        fearGreed,
        athDistance
      ).map((tip) => ({
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
            score={stocksScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isSp500Loading && isRsiLoading && isVixLoading && isFearGreedLoading}
            refetchAllData={refetchMarketStocksData}
            minLabel="Bearish"
            maxLabel="Bullish"
            label={STOCKS_LABELS.OverallScore}
            description={STOCKS_LABELS.Description}
          />
        </Grid>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 8,
        }}
        >
          <IndicatorsComponent
            indexList={StocksIndexList}
          />
        </Grid>
      </Grid>
      <StrategiesComponent strategiesList={StocksStrategyList} />
    </>
  );
};

export default MarketStocksComponent;
