export interface IMarketStocksContext extends IMarketStocksProvider  {
    updateMarketStocks: (newState: IMarketStocksProvider) => void;
};

export interface TStocksData {
  vix?: number;
  rsiSP500?: number;
  eurUsd?: number;
  fearGreed?: number;
  sp500Price?: number;
  sp500ATH?: number;
  sp500Prices?: number[];
  sp500Volumes?: number[];
  putCallRatio?: number;
  treasury10Y?: number;
  lastUpdated?: string;
}

export interface TStocksMetrics extends TStocksData {
  stocksScore: number;
  athDistance: number;
  momentum7d: number;
}

export interface IMarketStocksProvider extends TStocksData {
  isLoadingStocks?: boolean;
  refetchMarketStocksData?: () => void;
}
