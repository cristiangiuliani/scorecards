export type IMarketStocksContext = IMarketStocksProvider  & {
    updateMarketStocks: (newState: IMarketStocksProvider) => void;
};

export type TStocksData = {
  vix?: number;
  rsiSP500?: number;
  eurUsd?: number;
  fearGreed?: number;
  lastUpdated?: string;
}

export type IMarketStocksProvider = TStocksData &{
  isLoadingStocks?: boolean;
  refetchMarketStocksData?: () => void;
}
