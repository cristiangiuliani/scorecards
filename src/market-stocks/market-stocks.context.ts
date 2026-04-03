import {
  createContext,
} from 'react';

import type {
  IMarketStocksContext,
  IMarketStocksProvider,
} from '../interfaces/market-stocks';

export const MARKET_STOCKS_INITIAL_STATE: IMarketStocksProvider = {
  isLoadingStocks: false,
  vix: undefined,
  rsiSP500: undefined,
  eurUsd: undefined,
  fearGreed: undefined,
  sp500Price: undefined,
  sp500ATH: undefined,
  sp500Prices: undefined,
  sp500Volumes: undefined,
  putCallRatio: undefined,
  treasury10Y: undefined,
  isSp500Loading: false,
  isRsiLoading: false,
  isVixLoading: false,
  isEurUsdLoading: false,
  isFearGreedLoading: false,
  isPutCallRatioLoading: false,
  refetchMarketStocksData: () => {},
};

const MarketStocksContext = createContext<IMarketStocksContext>({
  ...MARKET_STOCKS_INITIAL_STATE,
  updateMarketStocks: () => {},
});

export default MarketStocksContext;
