import { Grid } from '@mui/material';
import React, { useContext } from 'react';

import { STOCKS_WEIGHTS } from '../constants/config';
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
      weight: STOCKS_WEIGHTS.vix,
      value: vix,
      score: calculateVixScore(vix),
      isLoading: isVixLoading,
    },
    {
      label: STOCKS_LABELS.RsiSP500,
      weight: STOCKS_WEIGHTS.rsi,
      value: rsiSP500,
      score: calculateRsiScore(rsiSP500),
      isLoading: isRsiLoading,
    },
    {
      label: STOCKS_LABELS.EurUsd,
      weight: STOCKS_WEIGHTS.eurUsd,
      value: eurUsd,
      score: calculateEurUsdScore(eurUsd),
      isLoading: isEurUsdLoading,
    },
    {
      label: STOCKS_LABELS.FearGreed,
      weight: STOCKS_WEIGHTS.fearGreed,
      value: fearGreed,
      score: calculateFearGreedScore(fearGreed),
      isLoading: isFearGreedLoading,
    },
    {
      label: STOCKS_LABELS.AthDistance,
      weight: STOCKS_WEIGHTS.athDistance,
      value: athDistance,
      score: calculateAthDistanceScore(sp500Price, sp500ATH),
      isLoading: isSp500Loading,
    },
    {
      label: STOCKS_LABELS.Momentum7D,
      weight: STOCKS_WEIGHTS.momentum,
      value: momentum7d,
      score: calculateMomentumScore(sp500Prices),
      isLoading: isSp500Loading,
    },
  ];

  const StocksStrategyList: TStrategiesListItem[] = [
    {
      title: '💼 Portfolio Strategy',
      color: interpretation.color,
      isLoading: isSp500Loading || isRsiLoading || isVixLoading || isFearGreedLoading,
      items: [
        {
          label: 'Market Phase',
          value: getMarketPhase(stocksScore, athDistance, vix),
        },
        {
          label: 'Time Horizon',
          value: getTimeHorizon(stocksScore, momentum7d),
        },
        {
          label: 'Allocation',
          value: getPortfolioAllocation(stocksScore, vix),
        },
      ],
    },
    {
      title: '🎯 Sector Focus',
      color: interpretation.color,
      isLoading: isRsiLoading || isVixLoading || isFearGreedLoading,
      items: [
        {
          label: 'Recommended Sectors',
          value: getSectorFocus(stocksScore, rsiSP500, vix),
        },
        {
          label: 'Key Metric',
          value: athDistance > 95
            ? `S&P500: ${athDistance.toFixed(1)}% of ATH`
            : `VIX: ${vix?.toFixed(1)}`,
        },
      ],
    },
    {
      title: '⚠️ Risk Management',
      color: interpretation.color,
      isLoading: isVixLoading || isRsiLoading || isFearGreedLoading,
      items: [
        {
          label: 'Risk Level',
          value: getRiskLevel(stocksScore, vix, rsiSP500, fearGreed, athDistance),
        },
      ],
    },
    {
      title: '💡 Action Items',
      color: interpretation.color,
      isLoading: isVixLoading || isRsiLoading || isFearGreedLoading,
      items: getActionableTips(
        stocksScore,
        vix,
        rsiSP500,
        fearGreed,
        athDistance
      ).map((tip, index) => ({
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
        <Grid size={4}>
          <ScoreCardsComponent
            score={stocksScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isSp500Loading && isRsiLoading && isVixLoading && isFearGreedLoading}
            refetchAllData={refetchMarketStocksData}
          />
        </Grid>
        <Grid size={8}>
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
