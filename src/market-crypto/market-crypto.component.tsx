import Grid from '@mui/material/Grid';
import React, {
  useContext,
} from 'react';
import { RSI } from 'technicalindicators';

import { CRYPTO_WEIGHTS } from '../constants/config';
import { COMMON_LABELS, CRYPTO_LABELS } from '../constants/labels';
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
  calculateAthDistanceScore,
  calculateBtcDominanceScore,
  calculateBtcFearGreedScore,
  calculateBtcRsiScore,
  calculateCryptoScore,
  calculateMomentum7d,
  calculateMomentumScore,
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
    cacheCreatedAt,
    cacheExpiresAt,
    isBtcDominanceLoading,
    isBtcFearGreedLoading,
    isBtcRsiLoading,
    isBtcLoading,
    refetchMarketCryptoData = () => {},
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
      label: CRYPTO_LABELS.BtcDominance,
      weight: CRYPTO_WEIGHTS.dominance,
      value: btcDominance,
      score: calculateBtcDominanceScore(btcDominance),
      isLoading: isBtcDominanceLoading,
    },
    {
      label: CRYPTO_LABELS.BtcRsi,
      weight: CRYPTO_WEIGHTS.rsi,
      value: btcRsi,
      score: calculateBtcRsiScore(btcRsi),
      isLoading: isBtcRsiLoading,
    },
    {
      label: CRYPTO_LABELS.AltSeasonIndex,
      weight: CRYPTO_WEIGHTS.altcoinSeason,
      value: altcoinSeasonIndex,
      score: calculateAltSeasonScore(altcoinSeasonIndex),
      isLoading: isBtcDominanceLoading,
    },
    {
      label: CRYPTO_LABELS.BtcFearGreed,
      weight: CRYPTO_WEIGHTS.fearGreed,
      value: btcFearGreed,
      score: calculateBtcFearGreedScore(btcFearGreed),
      isLoading: isBtcFearGreedLoading,
    },
    {
      label: CRYPTO_LABELS.AthDistance,
      weight: CRYPTO_WEIGHTS.athDistance,
      value: athDistance,
      score: calculateAthDistanceScore(currentPrice, ath),
      isLoading: isBtcLoading,
    },
    {
      label: CRYPTO_LABELS.Momentum7D,
      weight: CRYPTO_WEIGHTS.momentum,
      value: momentum7d,
      score: calculateMomentumScore(prices),
      isLoading: isBtcRsiLoading,
    },
  ];

  const interpretation = getCryptoInterpretation(cryptoScore);

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
        title: CRYPTO_LABELS.Strategy,
        color: interpretation.color,
        isLoading: isBtcLoading || isBtcRsiLoading || isBtcDominanceLoading || isBtcFearGreedLoading,
        items: [
          {
            label: CRYPTO_LABELS.MarketPhase,
            value: getMarketPhase(cryptoScore, athDistance),
          },
          {
            label: CRYPTO_LABELS.TimeHorizon,
            value: getTimeHorizon(cryptoScore, momentum7d),
          },
        ],
      },
      {
        title: CRYPTO_LABELS.BtcAltcoin,
        color: interpretation.color,
        isLoading: isBtcDominanceLoading,
        items: [
          {
            label: CRYPTO_LABELS.PortfolioBalance,
            value: getBtcAltBalance(btcDominance),
          },
          {
            label: CRYPTO_LABELS.BtcDominance,
            value: `${btcDominance.toFixed(1)}%`,
          },
        ],
      },
      {
        title: CRYPTO_LABELS.RiskManagement,
        color: interpretation.color,
        isLoading: isBtcRsiLoading || isBtcFearGreedLoading,
        items: [
          {
            label: COMMON_LABELS.RiskLevel,
            value: getRiskLevel(cryptoScore, btcRsi, btcFearGreed, athDistance),
          },
          {
            label: CRYPTO_LABELS.KeyMetric,
            value: athDistance > 95
              ? `${athDistance.toFixed(1)}% of ATH`
              : `RSI: ${btcRsi.toFixed(0)}`,
          },
        ],
      },
      {
        title: CRYPTO_LABELS.ActionItems,
        color: interpretation.color,
        isLoading: isBtcLoading || isBtcRsiLoading || isBtcDominanceLoading || isBtcFearGreedLoading,
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
            score={cryptoScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isBtcLoading || isBtcRsiLoading || isBtcDominanceLoading || isBtcFearGreedLoading}
            refetchAllData={refetchMarketCryptoData}
          />
        </Grid>
        <Grid size={8}>
          <IndicatorsComponent indexList={CryptoIndexList} />

        </Grid>
      </Grid>
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
    </>
  );
};

export default MarketCryptoComponent;
