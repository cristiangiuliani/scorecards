import Grid from '@mui/material/Grid';
import React, { useContext } from 'react';

import { CAPITAL_FLOWS_WEIGHTS, CAPITAL_FLOWS_RANGES } from '../constants/config';
import { CAPITAL_FLOWS_LABELS } from '../constants/labels';
import type { IMarketCapitalFlowsContext } from '../interfaces/market-capital-flows';
import IndicatorsComponent from '../shared/components/indicators.component';
import ScoreCardsComponent from '../shared/components/scorecards.component';
import StrategiesComponent from '../shared/components/strategies.component';
import type { TIndicatorsListItem, TStrategiesListItem } from '../types/data.type';

import MarketCapitalFlowsContext from './market-capital-flows.context';
import {
  calculateFedBalanceSheetScore,
  calculateM2MoneySupplyScore,
  calculateDollarIndexScore,
  calculateHighYieldSpreadScore,
  calculateTreasury10YScore,
  calculateStablecoinAccumulationScore,
  calculateCryptoMarketCapScore,
  calculateCapitalFlowsScore,
  calculateGrowthRate,
} from './utils/capital-flows-formulas';
import {
  getCapitalFlowsInterpretation,
  getMarketSentimentPhase,
  getLiquidityConditions,
  getRiskAppetiteLevel,
  getActionableTips,
  getAssetAllocationRecommendation,
  getTimeHorizon,
} from './utils/capital-flows-interpretation';

const MarketCapitalFlowsComponent: React.FC = () => {
  const {
    fedBalanceSheet = 0,
    m2MoneySupply = 0,
    dollarIndex = 0,
    highYieldSpread = 0,
    goldPrice = 0,
    stablecoinMarketCap = 0,
    totalCryptoMarketCap = 0,
    stablecoinDominance = 0,
    cacheCreatedAt,
    cacheExpiresAt,
    isFedBalanceSheetLoading,
    isM2MoneySupplyLoading,
    isDollarIndexLoading,
    isHighYieldSpreadLoading,
    isGoldPriceLoading,
    isStablecoinMarketCapLoading,
    isTotalCryptoMarketCapLoading,
    refetchMarketCapitalFlowsData = () => {},
  } = useContext<IMarketCapitalFlowsContext>(MarketCapitalFlowsContext);

  // Mock historical data for calculations (in production, these would come from API)
  // For now, using single values with trend calculation
  // Note: goldPrice is actually Treasury 10Y yield data (renamed endpoint)
  const fedBalanceSheetHistory = [fedBalanceSheet, fedBalanceSheet * 0.999, fedBalanceSheet * 0.998, fedBalanceSheet * 0.997, fedBalanceSheet * 0.996, fedBalanceSheet * 0.995, fedBalanceSheet * 0.994, fedBalanceSheet * 0.993, fedBalanceSheet * 0.992, fedBalanceSheet * 0.991, fedBalanceSheet * 0.99, fedBalanceSheet * 0.989];
  const m2History = [m2MoneySupply, m2MoneySupply * 0.999, m2MoneySupply * 0.998, m2MoneySupply * 0.997, m2MoneySupply * 0.996, m2MoneySupply * 0.995, m2MoneySupply * 0.994, m2MoneySupply * 0.993, m2MoneySupply * 0.992, m2MoneySupply * 0.991, m2MoneySupply * 0.99, m2MoneySupply * 0.989];
  const dollarIndexHistory = [dollarIndex, dollarIndex * 1.001];
  const treasury10YHistory = [goldPrice, goldPrice * 1.01, goldPrice * 1.02, goldPrice * 1.015];
  const cryptoMarketCapHistory = [totalCryptoMarketCap, totalCryptoMarketCap * 0.98, totalCryptoMarketCap * 0.96, totalCryptoMarketCap * 0.95];

  // Calculate individual scores
  const fedScore = calculateFedBalanceSheetScore(fedBalanceSheetHistory);
  const m2Score = calculateM2MoneySupplyScore(m2History);
  const dollarScore = calculateDollarIndexScore(dollarIndexHistory);
  const hySpreadScore = calculateHighYieldSpreadScore(highYieldSpread);
  const treasury10YScore = calculateTreasury10YScore(treasury10YHistory);
  const stablecoinScore = calculateStablecoinAccumulationScore(stablecoinMarketCap, totalCryptoMarketCap);
  const cryptoMcapScore = calculateCryptoMarketCapScore(cryptoMarketCapHistory);

  // Calculate overall Capital Flows Score
  const capitalFlowsScore = calculateCapitalFlowsScore(
    {
      fedBalanceSheet,
      m2MoneySupply,
      dollarIndex,
      highYieldSpread,
      goldPrice,
      stablecoinMarketCap,
      totalCryptoMarketCap,
      stablecoinDominance,
    },
    fedBalanceSheetHistory,
    m2History,
    dollarIndexHistory,
    treasury10YHistory,
    cryptoMarketCapHistory,
    CAPITAL_FLOWS_WEIGHTS
  );

  // Calculate growth rates for display
  const fedGrowthRate = calculateGrowthRate(fedBalanceSheetHistory[0], fedBalanceSheetHistory[11]);
  const m2GrowthRate = calculateGrowthRate(m2History[0], m2History[11]);
  const treasury10YChange = treasury10YHistory[0] - treasury10YHistory[3];
  // const cryptoMcapGrowthRate = calculateGrowthRate(cryptoMarketCapHistory[0], cryptoMarketCapHistory[3]);

  const CapitalFlowsIndexList: TIndicatorsListItem[] = [
    {
      label: CAPITAL_FLOWS_LABELS.FedBalanceSheet,
      description: CAPITAL_FLOWS_LABELS.FedBalanceSheetDescription,
      weight: CAPITAL_FLOWS_WEIGHTS.fedBalanceSheet,
      value: fedGrowthRate,
      score: fedScore,
      isLoading: isFedBalanceSheetLoading,
      min: CAPITAL_FLOWS_RANGES.fedBalanceSheetGrowth.min,
      max: CAPITAL_FLOWS_RANGES.fedBalanceSheetGrowth.max,
      minLabel: CAPITAL_FLOWS_RANGES.fedBalanceSheetGrowth.minLabel,
      maxLabel: CAPITAL_FLOWS_RANGES.fedBalanceSheetGrowth.maxLabel,
    },
    {
      label: CAPITAL_FLOWS_LABELS.M2MoneySupply,
      description: CAPITAL_FLOWS_LABELS.M2MoneySupplyDescription,
      weight: CAPITAL_FLOWS_WEIGHTS.m2MoneySupply,
      value: m2GrowthRate,
      score: m2Score,
      isLoading: isM2MoneySupplyLoading,
      min: CAPITAL_FLOWS_RANGES.m2Growth.min,
      max: CAPITAL_FLOWS_RANGES.m2Growth.max,
      minLabel: CAPITAL_FLOWS_RANGES.m2Growth.minLabel,
      maxLabel: CAPITAL_FLOWS_RANGES.m2Growth.maxLabel,
    },
    {
      label: CAPITAL_FLOWS_LABELS.DollarIndex,
      description: CAPITAL_FLOWS_LABELS.DollarIndexDescription,
      weight: CAPITAL_FLOWS_WEIGHTS.dollarIndex,
      value: dollarIndex,
      score: dollarScore,
      isLoading: isDollarIndexLoading,
      min: CAPITAL_FLOWS_RANGES.dollarIndex.min,
      max: CAPITAL_FLOWS_RANGES.dollarIndex.max,
      minLabel: CAPITAL_FLOWS_RANGES.dollarIndex.minLabel,
      maxLabel: CAPITAL_FLOWS_RANGES.dollarIndex.maxLabel,
    },
    {
      label: CAPITAL_FLOWS_LABELS.HighYieldSpread,
      description: CAPITAL_FLOWS_LABELS.HighYieldSpreadDescription,
      weight: CAPITAL_FLOWS_WEIGHTS.highYieldSpread,
      value: highYieldSpread,
      score: hySpreadScore,
      isLoading: isHighYieldSpreadLoading,
      min: CAPITAL_FLOWS_RANGES.highYieldSpread.min,
      max: CAPITAL_FLOWS_RANGES.highYieldSpread.max,
      minLabel: CAPITAL_FLOWS_RANGES.highYieldSpread.minLabel,
      maxLabel: CAPITAL_FLOWS_RANGES.highYieldSpread.maxLabel,
    },
    {
      label: CAPITAL_FLOWS_LABELS.Treasury10Y,
      description: CAPITAL_FLOWS_LABELS.Treasury10YDescription,
      weight: CAPITAL_FLOWS_WEIGHTS.treasury10Y,
      value: treasury10YChange,
      score: treasury10YScore,
      isLoading: isGoldPriceLoading,
      min: CAPITAL_FLOWS_RANGES.treasury10YChange.min,
      max: CAPITAL_FLOWS_RANGES.treasury10YChange.max,
      minLabel: CAPITAL_FLOWS_RANGES.treasury10YChange.minLabel,
      maxLabel: CAPITAL_FLOWS_RANGES.treasury10YChange.maxLabel,
    },
    {
      label: CAPITAL_FLOWS_LABELS.StablecoinAccumulation,
      description: CAPITAL_FLOWS_LABELS.StablecoinAccumulationDescription,
      weight: CAPITAL_FLOWS_WEIGHTS.stablecoinAccumulation,
      value: stablecoinDominance,
      score: stablecoinScore,
      isLoading: isStablecoinMarketCapLoading || isTotalCryptoMarketCapLoading,
      min: CAPITAL_FLOWS_RANGES.stablecoinDominance.min,
      max: CAPITAL_FLOWS_RANGES.stablecoinDominance.max,
      minLabel: CAPITAL_FLOWS_RANGES.stablecoinDominance.minLabel,
      maxLabel: CAPITAL_FLOWS_RANGES.stablecoinDominance.maxLabel,
    },
  ];

  const interpretation = getCapitalFlowsInterpretation(capitalFlowsScore);

  const getCapitalFlowsStrategies = (): TStrategiesListItem[] => {
    const marketPhase = getMarketSentimentPhase(capitalFlowsScore);
    const liquidityConditions = getLiquidityConditions(fedScore, m2Score, dollarScore);
    const riskAppetite = getRiskAppetiteLevel(hySpreadScore, treasury10YScore, stablecoinScore);
    const assetAllocation = getAssetAllocationRecommendation(capitalFlowsScore);
    const timeHorizon = getTimeHorizon(capitalFlowsScore);
    const actionableTips = getActionableTips(capitalFlowsScore, fedScore, stablecoinScore, cryptoMcapScore);

    const isLoading =
      isFedBalanceSheetLoading ||
      isM2MoneySupplyLoading ||
      isDollarIndexLoading ||
      isHighYieldSpreadLoading ||
      isGoldPriceLoading ||
      isStablecoinMarketCapLoading ||
      isTotalCryptoMarketCapLoading;

    return [
      {
        title: '💧 Liquidity & Sentiment',
        color: interpretation.color,
        isLoading,
        items: [
          {
            label: CAPITAL_FLOWS_LABELS.MarketSentimentPhase,
            value: marketPhase,
          },
          {
            label: CAPITAL_FLOWS_LABELS.LiquidityConditions,
            value: liquidityConditions,
          },
          {
            label: CAPITAL_FLOWS_LABELS.RiskAppetite,
            value: riskAppetite,
          },
        ],
      },
      {
        title: '💼 Portfolio Strategy',
        color: interpretation.color,
        isLoading,
        items: [
          {
            label: CAPITAL_FLOWS_LABELS.AssetAllocation,
            value: assetAllocation,
          },
          {
            label: CAPITAL_FLOWS_LABELS.TimeHorizon,
            value: timeHorizon,
          },
        ],
      },
      {
        title: `✅ ${CAPITAL_FLOWS_LABELS.ActionItems}`,
        color: interpretation.color,
        isLoading,
        items: actionableTips.map((tip) => ({
          label: '',
          value: tip,
        })),
      },
    ];
  };

  const strategies = getCapitalFlowsStrategies();

  const isLoading =
    isFedBalanceSheetLoading ||
    isM2MoneySupplyLoading ||
    isDollarIndexLoading ||
    isHighYieldSpreadLoading ||
    isGoldPriceLoading ||
    isStablecoinMarketCapLoading ||
    isTotalCryptoMarketCapLoading;

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
            score={capitalFlowsScore}
            interpretation={interpretation}
            cacheCreatedAt={cacheCreatedAt}
            cacheExpiresAt={cacheExpiresAt}
            isLoading={isLoading}
            label={CAPITAL_FLOWS_LABELS.OverallScore}
            description={CAPITAL_FLOWS_LABELS.Description}
            minLabel="Outflow"
            maxLabel="Inflow"
            refetchAllData={refetchMarketCapitalFlowsData}
          />
        </Grid>
        <Grid size={{
          xs: 12,
          sm: 6,
          md: 8,
        }}
        >
          <IndicatorsComponent indexList={CapitalFlowsIndexList} />
        </Grid>
      </Grid>
      <StrategiesComponent strategiesList={strategies} />
    </>
  );
};

export default MarketCapitalFlowsComponent;
