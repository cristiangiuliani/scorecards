import {
  createContext,
} from 'react';

import type { IMarketStocksContext } from '../interfaces/market-stocks';

const MarketStocksContext = createContext<IMarketStocksContext>({
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
  updateMarketStocks: () => {},
});

export default MarketStocksContext;
