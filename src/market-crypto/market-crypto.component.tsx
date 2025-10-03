import Box from '@mui/material/Box';
import React, {
  useContext,
} from 'react';

import { MarketIndexLabels } from '../enums/market-indexes';
import type { IMarketCryptoContext } from '../interfaces/market-crypto';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type {
  TIndicatorsListItem,
  TStrategiesListItem,
} from '../types/data.type';
import {
  calculateAltSeasonScore,
  calculateBtcDominanceScore,
  calculateBtcFearGreedScore,
  calculateBtcRsiScore,
  calculateCryptoScore,
  getCryptoInterpretation,
} from '../utils/crypto-formulas';

import MarketCryptoContext from './market-crypto.context';

const MarketCryptoComponent: React.FC = () => {
  const {
    btcDominance,
    btcRsi,
    altcoinSeasonIndex,
    btcFearGreed,
    currentPrice,
    ath,
    prices,
    volumes,
    lastUpdated,
  } = useContext<IMarketCryptoContext>(MarketCryptoContext);

  if (btcDominance === undefined) return;

  const cryptoScore = calculateCryptoScore({
    btcDominance,
    btcRsi,
    altcoinSeasonIndex,
    btcFearGreed,
    currentPrice,
    ath,
    prices,
    volumes,
  });

  const CryptoIndexList:TIndicatorsListItem[] = [
    {
      label: MarketIndexLabels.BtcDominance,
      weight: 1.3,
      value: btcDominance,
      score: calculateBtcDominanceScore(btcDominance),
    },
    {
      label: MarketIndexLabels.BtcRsi,
      weight: 1.2,
      value: btcRsi,
      score: calculateBtcRsiScore(btcRsi),
    },
    {
      label: MarketIndexLabels.AltSeasonIndex,
      weight: 0.8,
      value: altcoinSeasonIndex,
      score: calculateAltSeasonScore(altcoinSeasonIndex),
    },
    {
      label: MarketIndexLabels.BtcFearGreed,
      weight: 1.2,
      value: btcFearGreed,
      score: calculateBtcFearGreedScore(btcFearGreed),
    },

  ];

  const CryptoStrategyList:TStrategiesListItem[] = [
    {
      title: '₿ Crypto Strategy',
      color: 'secondary',
      items: [
        {
          label: 'Market Phase',
          value: cryptoScore > 2 ? 'Active bull market' :
            cryptoScore < -2 ? 'Bear market / Winter' :
              'Crab market / Accumulation',
        },
      ],
    },
    {
      title: '⚖️ BTC vs Altcoins',
      color: 'info',
      items: [
        {
          label: 'Current Balance',
          value: btcDominance > 60 ? 'Focus Bitcoin (quality)' :
            btcDominance < 45 ? 'Active altseason' :
              'BTC/Alt balance',
        },
      ],
    },
    {
      title: '🚨 Risk Level',
      color: 'error',
      items: [
        {
          label: 'Current Risk',
          value: Math.abs(cryptoScore) > 4 ? 'Extreme - Prepare exit/entry' :
            Math.abs(cryptoScore) > 2 ? 'Moderate - Active trend' :
              'Low - Patience/DCA',
        },
      ],
    },
  ];

  return (
    <>
      <Box>
        <ScoreCardsComponent
          score={cryptoScore}
          interpretation={getCryptoInterpretation(cryptoScore)}
          lastUpdated={lastUpdated}
        />

        <IndicatorsComponent indexList={CryptoIndexList} />

        <StrategiesComponent
          strategiesList={CryptoStrategyList}
        />
      </Box>
    </>
  );
};

export default MarketCryptoComponent;
