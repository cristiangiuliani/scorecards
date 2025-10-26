import btcMockData from '../_mocks/btc.json';
import btcDominanceMockData from '../_mocks/btcDominance.json';
import btcFearGreedMockData from '../_mocks/btcFearGreed.json';
import btcRsiMockData from '../_mocks/btcRsi.json';
import eurUsdMockData from '../_mocks/eurUsd.json';
import fearGreedMockData from '../_mocks/fearGreed.json';
import rsiSP500MockData from '../_mocks/rsiSp500.json';
import sp500MockData from '../_mocks/sp500.json';
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
};
