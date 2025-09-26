export type TStocksData = {
  vix: number;
  rsiSP500: number;
  eurUsd: number;
  fearGreed: number;
  lastUpdated: string;
}

export type TCryptoData = {
  btcFearGreed: number;
  btcRsi: number;
  btcDominance: number;
  altSeasonIndex: number;
  lastUpdated: string;
}

export type TInterpretation = {
  text: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'default';
    severity: 'success' | 'warning' | 'error' | 'info';
};
