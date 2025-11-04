import Grid from '@mui/material/Grid';
import React, {
  useContext,
} from 'react';
import { RSI } from 'technicalindicators';

import { CRYPTO_WEIGHTS, CRYPTO_RANGES } from '../constants/config';
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
      description: 'Bitcoin market share relative to total crypto market cap. Higher dominance (>60%) indicates capital flowing into BTC, while lower values (<50%) suggest altcoin season.',
      weight: CRYPTO_WEIGHTS.dominance,
      value: btcDominance,
      score: calculateBtcDominanceScore(btcDominance),
      isLoading: isBtcDominanceLoading,
      min: CRYPTO_RANGES.dominance.min,
      max: CRYPTO_RANGES.dominance.max,
      minLabel: CRYPTO_RANGES.dominance.minLabel,
      maxLabel: CRYPTO_RANGES.dominance.maxLabel,
    },
    {
      label: CRYPTO_LABELS.BtcRsi,
      description: 'Relative Strength Index (14-day) measures momentum. Values above 70 indicate overbought conditions (potential correction), while below 30 suggests oversold (potential buying opportunity).',
      weight: CRYPTO_WEIGHTS.rsi,
      value: btcRsi,
      score: calculateBtcRsiScore(btcRsi),
      isLoading: isBtcRsiLoading,
      min: CRYPTO_RANGES.rsi.min,
      max: CRYPTO_RANGES.rsi.max,
      minLabel: CRYPTO_RANGES.rsi.minLabel,
      maxLabel: CRYPTO_RANGES.rsi.maxLabel,
    },
    {
      label: CRYPTO_LABELS.AltSeasonIndex,
      description: 'Measures altcoin performance vs Bitcoin. Values above 75 indicate strong altcoin season, while below 25 shows Bitcoin outperformance. Based on top altcoins vs BTC performance.',
      weight: CRYPTO_WEIGHTS.altcoinSeason,
      value: altcoinSeasonIndex,
      score: calculateAltSeasonScore(altcoinSeasonIndex),
      isLoading: isBtcDominanceLoading,
      min: CRYPTO_RANGES.altcoinSeason.min,
      max: CRYPTO_RANGES.altcoinSeason.max,
      minLabel: CRYPTO_RANGES.altcoinSeason.minLabel,
      maxLabel: CRYPTO_RANGES.altcoinSeason.maxLabel,
    },
    {
      label: CRYPTO_LABELS.BtcFearGreed,
      description: 'Market sentiment indicator combining volatility, momentum, social media and surveys. Extreme Fear (<25) often presents buying opportunities, Extreme Greed (>75) suggests caution.',
      weight: CRYPTO_WEIGHTS.fearGreed,
      value: btcFearGreed,
      score: calculateBtcFearGreedScore(btcFearGreed),
      isLoading: isBtcFearGreedLoading,
      min: CRYPTO_RANGES.fearGreed.min,
      max: CRYPTO_RANGES.fearGreed.max,
      minLabel: CRYPTO_RANGES.fearGreed.minLabel,
      maxLabel: CRYPTO_RANGES.fearGreed.maxLabel,
    },
    {
      label: CRYPTO_LABELS.AthDistance,
      description: 'Shows how far Bitcoin is from its all-time high peak. Values above 95% indicate near ATH (high risk zone), while lower values suggest better risk/reward ratio for accumulation.',
      weight: CRYPTO_WEIGHTS.athDistance,
      value: athDistance,
      score: calculateAthDistanceScore(currentPrice, ath),
      isLoading: isBtcLoading,
      min: CRYPTO_RANGES.athDistance.min,
      max: CRYPTO_RANGES.athDistance.max,
      minLabel: CRYPTO_RANGES.athDistance.minLabel,
      maxLabel: CRYPTO_RANGES.athDistance.maxLabel,
    },
    {
      label: CRYPTO_LABELS.Momentum7D,
      description: '7-day price momentum showing short-term trend strength. Positive values indicate upward momentum, negative values show downward pressure. Helps identify trend reversals.',
      weight: CRYPTO_WEIGHTS.momentum,
      value: momentum7d,
      score: calculateMomentumScore(prices),
      isLoading: isBtcRsiLoading,
      min: CRYPTO_RANGES.momentum.min,
      max: CRYPTO_RANGES.momentum.max,
      minLabel: CRYPTO_RANGES.momentum.minLabel,
      maxLabel: CRYPTO_RANGES.momentum.maxLabel,
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
        ).map((tip) => ({
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
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
        >
          <ScoreCardsComponent
            score={cryptoScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isBtcLoading || isBtcRsiLoading || isBtcDominanceLoading || isBtcFearGreedLoading}
            refetchAllData={refetchMarketCryptoData}
            minLabel="Bearish"
            maxLabel="Bullish"
            label={CRYPTO_LABELS.OverallScore}
            description={CRYPTO_LABELS.Description}
          />
        </Grid>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 8,
        }}
        >
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
