import Box from '@mui/material/Box';
import React, {
  useContext,
} from 'react';

import { MarketIndexLabels } from '../enums/market-indexes';
import type { IMarketStocksContext } from '../interfaces/market-stocks';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type {
  TIndicatorsListItem,
  TStrategiesListItem,
} from '../types/data.type';
import {
  calculateEurUsdScore, calculateFearGreedScore, calculateRsiScore, calculateStocksScore, calculateVixScore, getStockInterpretation,
} from '../utils/stocks-formulas';

import MarketStocksContext from './market-stocks.context';

const MarketStocksComponent: React.FC = () => {
  const {
    vix, rsiSP500, eurUsd, fearGreed, lastUpdated,
  } = useContext<IMarketStocksContext>(MarketStocksContext);

  const stocksScore = calculateStocksScore({
    vix,
    rsiSP500,
    eurUsd,
    fearGreed,
  });

  const StocksIndexList:TIndicatorsListItem[] = [
    {
      label: MarketIndexLabels.Vix,
      weight: 1.3,
      value: vix,
      score: calculateVixScore(vix),
    },
    {
      label: MarketIndexLabels.RsiSP500,
      weight: 1.2,
      value: rsiSP500,
      score: calculateRsiScore(rsiSP500),
    },
    {
      label: MarketIndexLabels.EurUsd,
      weight: 0.8,
      value: eurUsd,
      score: calculateEurUsdScore(eurUsd),
    },
    {
      label: MarketIndexLabels.FearGreed,
      weight: 1.2,
      value: fearGreed,
      score: calculateFearGreedScore(fearGreed),
    },
  ];

  const StocksStrategyList:TStrategiesListItem[] = [
    {
      title: '💼 Portfolio Strategy',
      color: 'primary',
      items: [
        {
          label: 'Current Allocation',
          value: stocksScore > 3 ? 'Increase equity exposure' :
            stocksScore < -3 ? 'Increase bonds and defensives' :
              'Maintain balanced allocation',
        },
      ],
    },
    {
      title: '🎯 Sector Focus',
      color: 'success',
      items: [
        {
          label: 'Recommended Sectors',
          value: stocksScore > 3 ? 'Tech, Growth, Small Cap' :
            stocksScore < -3 ? 'Defense, Staples, REITs' :
              'Current diversification OK',
        },
      ],
    },
    {
      title: '⚠️ Risk Management',
      color: 'warning',
      items: [
        {
          label: 'Risk Level',
          value: Math.abs(stocksScore) > 6 ? 'Caution: extreme signal' :
            Math.abs(stocksScore) > 3 ? 'Active monitoring' :
              'Controlled risk',
        },
      ],
    },
  ];

  // const { btcDominance = 0 } = cryptoData;

  // const CryptoStrategyList = [
  //   {
  //     title: '₿ Crypto Strategy',
  //     color: 'secondary',
  //     items: [
  //       {
  //         label: 'Market Phase',
  //         value: cryptoScore > 2 ? 'Active bull market' :
  //           cryptoScore < -2 ? 'Bear market / Winter' :
  //             'Crab market / Accumulation',
  //       },
  //     ],
  //   },
  //   {
  //     title: '⚖️ BTC vs Altcoins',
  //     color: 'info',
  //     items: [
  //       {
  //         label: 'Current Balance',
  //         value: btcDominance > 60 ? 'Focus Bitcoin (quality)' :
  //           btcDominance < 45 ? 'Active altseason' :
  //             'BTC/Alt balance',
  //       },
  //     ],
  //   },
  //   {
  //     title: '🚨 Risk Level',
  //     color: 'error',
  //     items: [
  //       {
  //         label: 'Current Risk',
  //         value: Math.abs(cryptoScore) > 4 ? 'Extreme - Prepare exit/entry' :
  //           Math.abs(cryptoScore) > 2 ? 'Moderate - Active trend' :
  //             'Low - Patience/DCA',
  //       },
  //     ],
  //   },
  // ];

  return (
    <>
      <Box>
        <ScoreCardsComponent
          score={stocksScore}
          interpretation={getStockInterpretation(stocksScore)}
          lastUpdated={lastUpdated}
        />

        <IndicatorsComponent indexList={StocksIndexList} />

        <StrategiesComponent
          strategiesList={StocksStrategyList}
        />
      </Box>
    </>
  );
};

export default MarketStocksComponent;
