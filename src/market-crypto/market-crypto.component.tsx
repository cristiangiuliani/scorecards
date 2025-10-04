import Box from '@mui/material/Box';
import React, {
  useContext,
} from 'react';
import { RSI } from 'technicalindicators';

import { MarketIndexLabels } from '../enums/market-indexes';
import type { IMarketCryptoContext } from '../interfaces/market-crypto';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type {
  TCryptoMetrics,
  TIndicatorsListItem,
  TStrategiesListItem,
} from '../types/data.type';

import MarketCryptoContext from './market-crypto.context';
import {
  calculateAltcoinSeasonIndex,
  calculateAltSeasonScore,
  calculateAthDistance,
  calculateBtcDominanceScore,
  calculateBtcFearGreedScore,
  calculateBtcRsiScore,
  calculateCryptoScore,
  calculateMomentum7d,
} from './utils/crypto-formulas';
import {
  getActionableTips, getBtcAltBalance, getCryptoInterpretation, getMarketPhase, getRiskLevel, getTimeHorizon,
} from './utils/crypto-interpretation';

const MarketCryptoComponent: React.FC = () => {
  const {
    btcDominance = 0,
    btcFearGreed = 0,
    currentPrice,
    ath,
    prices = [],
    volumes = [],
    lastUpdated,
  } = useContext<IMarketCryptoContext>(MarketCryptoContext);

  const btcRsiValues = RSI.calculate({
    values: prices,
    period: 14,
  });

  const btcRsi = btcRsiValues?.length > 0 ? btcRsiValues[btcRsiValues.length - 1] : 0;

  const athDistance =  calculateAthDistance(currentPrice, ath);

  const momentum7d = calculateMomentum7d(prices);

  const altcoinSeasonIndex = calculateAltcoinSeasonIndex(btcDominance);

  const cryptoScore = calculateCryptoScore({
    btcDominance,
    btcFearGreed,
    currentPrice,
    ath,
    prices,
    volumes,
  }, btcRsi, altcoinSeasonIndex);

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

  const getCryptoStrategies = (metrics: TCryptoMetrics): TStrategiesListItem[] => {
    const {
      cryptoScore,
      btcDominance,
      btcRsi,
      btcFearGreed,
      athDistance,
      momentum7d,
    } = metrics;

    return [
      {
        title: '₿ Crypto Strategy',
        color: 'secondary',
        items: [
          {
            label: 'Market Phase',
            value: getMarketPhase(cryptoScore, athDistance),
          },
          {
            label: 'Time Horizon',
            value: getTimeHorizon(cryptoScore, momentum7d),
          },
        ],
      },
      {
        title: '⚖️ BTC vs Altcoins',
        color: 'info',
        items: [
          {
            label: 'Portfolio Balance',
            value: getBtcAltBalance(btcDominance),
          },
          {
            label: 'BTC Dominance',
            value: `${btcDominance.toFixed(1)}%`,
          },
        ],
      },
      {
        title: '🚨 Risk Management',
        color: 'error',
        items: [
          {
            label: 'Risk Level',
            value: getRiskLevel(cryptoScore, btcRsi, btcFearGreed, athDistance),
          },
          {
            label: 'Key Metric',
            value: athDistance > 95
              ? `${athDistance.toFixed(1)}% of ATH`
              : `RSI: ${btcRsi.toFixed(0)}`,
          },
        ],
      },
      {
        title: '💡 Action Items',
        color: 'warning',
        items: getActionableTips(
          cryptoScore,
          btcRsi,
          btcFearGreed,
          athDistance,
          btcDominance
        ).map((tip, index) => ({
          label: `Tip ${index + 1}`,
          value: tip,
        })),
      },
    ];
  };

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
          strategiesList={getCryptoStrategies({
            cryptoScore,
            btcDominance,
            btcRsi,
            btcFearGreed,
            athDistance,
            momentum7d,
          })}
        />
      </Box>
    </>
  );
};

export default MarketCryptoComponent;
