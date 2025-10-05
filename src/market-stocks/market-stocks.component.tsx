import Box from '@mui/material/Box';
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
  calculateEurUsdScore,
  calculateFearGreedScore,
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
    lastUpdated,
  } = useContext<IMarketStocksContext>(MarketStocksContext);

  // ============================================
  // CALCOLA VALORI DERIVATI
  // ============================================

  // Distance from ATH (percentuale)
  const athDistance = sp500Price && sp500ATH
    ? (sp500Price / sp500ATH) * 100
    : 0;

  // Momentum 7 giorni (percentuale variazione)
  const momentum7d = sp500Prices && sp500Prices.length >= 8
    ? ((sp500Prices[sp500Prices.length - 1] - sp500Prices[sp500Prices.length - 8])
       / sp500Prices[sp500Prices.length - 8]) * 100
    : 0;

  // ============================================
  // CALCOLA STOCKS SCORE
  // ============================================

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

  const StocksIndexList: TIndicatorsListItem[] = [
    {
      label: STOCKS_LABELS.Vix,
      weight: STOCKS_WEIGHTS.vix,
      value: vix,
      score: calculateVixScore(vix),
    },
    {
      label: STOCKS_LABELS.RsiSP500,
      weight: STOCKS_WEIGHTS.rsi,
      value: rsiSP500,
      score: calculateRsiScore(rsiSP500),
    },
    {
      label: STOCKS_LABELS.EurUsd,
      weight: STOCKS_WEIGHTS.eurUsd,
      value: eurUsd,
      score: calculateEurUsdScore(eurUsd),
    },
    {
      label: STOCKS_LABELS.FearGreed,
      weight: STOCKS_WEIGHTS.fearGreed,
      value: fearGreed,
      score: calculateFearGreedScore(fearGreed),
    },
  ];

  // ============================================
  // STRATEGIE (usando funzioni importate)
  // ============================================

  const StocksStrategyList: TStrategiesListItem[] = [
    {
      title: '💼 Portfolio Strategy',
      color: 'primary',
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
      color: 'success',
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
      color: 'warning',
      items: [
        {
          label: 'Risk Level',
          value: getRiskLevel(stocksScore, vix, rsiSP500, fearGreed, athDistance),
        },
      ],
    },
    {
      title: '💡 Action Items',
      color: 'error',
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
      <Box>
        <ScoreCardsComponent
          score={stocksScore}
          interpretation={getStockInterpretation(stocksScore)}
          lastUpdated={lastUpdated}
        />

        <IndicatorsComponent indexList={StocksIndexList} />

        <StrategiesComponent strategiesList={StocksStrategyList} />
      </Box>
    </>
  );
};

export default MarketStocksComponent;
