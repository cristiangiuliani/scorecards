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
  refetchMarketStocksData: () => {},
  updateMarketStocks: () => {},
});

export default MarketStocksContext;
