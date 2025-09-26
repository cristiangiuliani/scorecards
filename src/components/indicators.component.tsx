import Grid from '@mui/material/Grid';
import React, {
  useContext,
} from 'react';

import DashboardContext from '../context/dashboard.context';
import { MarketIndexLabels } from '../enums/market-indexes';
import type {
  IDashboardContext,
} from '../interfaces/dashboard';
import IndicatorCardLayout from '../layouts/indicator-card.layout';
import {
  calculateEurUsdScore, calculateFearGreedScore, calculateRsiScore, calculateVixScore,
} from '../utils/formula';

const IndicatorsComponent: React.FC = () => {
  const {
    stocksData,
    cryptoData,
    activeTab,
  } = useContext<IDashboardContext>(DashboardContext);

  if (!stocksData || !cryptoData) return;

  const StocksIndexList = [
    {
      label: MarketIndexLabels.Vix,
      weight: 1.3,
      value: stocksData.vix,
      score: calculateVixScore(stocksData.vix),
    },
    {
      label: MarketIndexLabels.RsiSP500,
      weight: 1.2,
      value: stocksData.rsiSP500,
      score: calculateRsiScore(stocksData.rsiSP500),
    },
    {
      label: MarketIndexLabels.EurUsd,
      weight: 0.8,
      value: stocksData.eurUsd,
      score: calculateEurUsdScore(stocksData.eurUsd),
    },
    {
      label: MarketIndexLabels.FearGreed,
      weight: 1.2,
      value: stocksData.fearGreed,
      score: calculateFearGreedScore(stocksData.fearGreed),
    },
  ];

  const CryptoIndexList = [
    {
      label: MarketIndexLabels.BtcFearGreed,
      weight: 1.3,
      value: cryptoData.btcFearGreed,
      score: calculateVixScore(cryptoData.btcFearGreed),
    },
    {
      label: MarketIndexLabels.BtcRsi,
      weight: 1.2,
      value: cryptoData.btcRsi,
      score: calculateRsiScore(cryptoData.btcRsi),
    },
    {
      label: MarketIndexLabels.BtcDominance,
      weight: 0.8,
      value: cryptoData.btcDominance,
      score: calculateEurUsdScore(cryptoData.btcDominance),
    },
    {
      label: MarketIndexLabels.AltSeasonIndex,
      weight: 1.2,
      value: cryptoData.altSeasonIndex,
      score: calculateFearGreedScore(cryptoData.altSeasonIndex),
    },
  ];

  const indexListToShow = activeTab === 0 ? StocksIndexList : CryptoIndexList;

  return (
    <>

      <Grid container spacing={3} mb={4}>
        {
          indexListToShow.map((item) => (
            <Grid
              key={item.label}
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <IndicatorCardLayout
                label={item.label}
                value={item.value}
                score={item.score}
                weight={String(item.weight)}
              />
            </Grid>
          ))
        }
      </Grid>

    </>
  );
};

export default IndicatorsComponent;
