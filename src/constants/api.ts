import btcMockData from '../_mocks/btc.json';
import btcDominanceMockData from '../_mocks/btcDominance.json';
import btcFearGreedMockData from '../_mocks/btcFearGreed.json';
import btcRsiMockData from '../_mocks/btcRsi.json';
import eurUsdMockData from '../_mocks/eurUsd.json';
import fearGreedMockData from '../_mocks/fearGreed.json';
import fredBAMLMockData from '../_mocks/fredBAML.json';
import fredCPIMockData from '../_mocks/fredCPI.json';
import fredDGS10MockData from '../_mocks/fredDGS10.json';
import fredDGS2MockData from '../_mocks/fredDGS2.json';
import fredDGS5MockData from '../_mocks/fredDGS5.json';
import fredDollarIndexMockData from '../_mocks/fredDollarIndex.json';
import fredFedFundsMockData from '../_mocks/fredFedFunds.json';
import fredGoldMockData from '../_mocks/fredGold.json';
import fredM2MockData from '../_mocks/fredM2.json';
import fredPCEMockData from '../_mocks/fredPCE.json';
import fredT10YIEMockData from '../_mocks/fredT10YIE.json';
import fredUnemploymentMockData from '../_mocks/fredUnemployment.json';
import fredWagesMockData from '../_mocks/fredWages.json';
import fredWALCLMockData from '../_mocks/fredWALCL.json';
import globalCryptoDataMockData from '../_mocks/globalCryptoData.json';
import rsiSP500MockData from '../_mocks/rsiSp500.json';
import sp500MockData from '../_mocks/sp500.json';
import stablecoinsMockData from '../_mocks/stablecoins.json';
import vixMockData from '../_mocks/vix.json';

export interface IApiEndpoint {
  functionName: string;
  mockData: unknown;
}

export const API: Record<string, IApiEndpoint> = {
  btc: {
    functionName: 'fetchBtc',
    mockData: btcMockData,
  },
  btcDominance: {
    functionName: 'fetchBtcDominance',
    mockData: btcDominanceMockData,
  },
  btcFearGreed: {
    functionName: 'fetchBtcFearGreed',
    mockData: btcFearGreedMockData,
  },
  btcRsi: {
    functionName: 'fetchBtcRsi',
    mockData: btcRsiMockData,
  },
  eurUsd: {
    functionName: 'fetchEurUsd',
    mockData: eurUsdMockData,
  },
  fearGreed: {
    functionName: 'fetchFearGreed',
    mockData: fearGreedMockData,
  },
  rsiSP500: {
    functionName: 'fetchRsiSP500',
    mockData: rsiSP500MockData,
  },
  sp500: {
    functionName: 'fetchSP500',
    mockData: sp500MockData,
  },
  vix: {
    functionName: 'fetchVix',
    mockData: vixMockData,
  },
  peRatioNvda: {
    functionName: 'fetchPeRatioNvda',
    mockData: vixMockData,
  },
  fredDGS10: {
    functionName: 'fetchFredDGS10',
    mockData: fredDGS10MockData,
  },
  fredDGS5: {
    functionName: 'fetchFredDGS5',
    mockData: fredDGS5MockData,
  },
  fredDGS2: {
    functionName: 'fetchFredDGS2',
    mockData: fredDGS2MockData,
  },
  fredBAML: {
    functionName: 'fetchFredBAML',
    mockData: fredBAMLMockData,
  },
  fredT10YIE: {
    functionName: 'fetchFredT10YIE',
    mockData: fredT10YIEMockData,
  },
  fredWALCL: {
    functionName: 'fetchFredWALCL',
    mockData: fredWALCLMockData,
  },
  fredM2: {
    functionName: 'fetchFredM2',
    mockData: fredM2MockData,
  },
  fredDollarIndex: {
    functionName: 'fetchFredDollarIndex',
    mockData: fredDollarIndexMockData,
  },
  fredGold: {
    functionName: 'fetchFredGold',
    mockData: fredGoldMockData,
  },
  stablecoins: {
    functionName: 'fetchStablecoins',
    mockData: stablecoinsMockData,
  },
  globalCryptoData: {
    functionName: 'fetchGlobalCryptoData',
    mockData: globalCryptoDataMockData,
  },
  fredCPI: {
    functionName: 'fetchFredCPI',
    mockData: fredCPIMockData,
  },
  fredPCE: {
    functionName: 'fetchFredPCE',
    mockData: fredPCEMockData,
  },
  fredUnemployment: {
    functionName: 'fetchFredUnemployment',
    mockData: fredUnemploymentMockData,
  },
  fredWages: {
    functionName: 'fetchFredWages',
    mockData: fredWagesMockData,
  },
  fredFedFunds: {
    functionName: 'fetchFredFedFunds',
    mockData: fredFedFundsMockData,
  },
};
