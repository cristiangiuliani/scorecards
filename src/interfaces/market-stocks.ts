export interface IMarketStocksContext extends IMarketStocksProvider  {
    updateMarketStocks: (newState: IMarketStocksProvider) => void;
};

export interface IStocksData {
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
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface IStocksDataStatus extends IStocksData {
  isSp500Loading?: boolean;
  isRsiLoading?: boolean;
  isVixLoading?: boolean;
  isEurUsdLoading?: boolean;
  isFearGreedLoading?: boolean;
  isPutCallRatioLoading?: boolean;
}

export interface IMarketStocksProvider extends IStocksDataStatus {
  isLoadingStocks?: boolean;
  refetchMarketStocksData?: () => void;
}

export interface IStocksMetrics extends IStocksData {
  stocksScore: number;
  athDistance: number;
  momentum7d: number;
}
