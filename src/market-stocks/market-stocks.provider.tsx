import {
  useState, type ReactNode,
} from 'react';

import type { IMarketStocksProvider } from '../interfaces/market-stocks';

import MarketStocksContext, { MARKET_STOCKS_INITIAL_STATE } from './market-stocks.context';

export const MarketStocksProvider = ({
  children,
}: { children: ReactNode }) => {
  const [marketStocks, setMarketStocks] = useState<IMarketStocksProvider>(MARKET_STOCKS_INITIAL_STATE);

  const updateMarketStocks = (newState: IMarketStocksProvider = MARKET_STOCKS_INITIAL_STATE) => {
    setMarketStocks((prevState: IMarketStocksProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <MarketStocksContext.Provider value={{
      ...marketStocks,
      updateMarketStocks,
    }}
    >
      { children }
    </MarketStocksContext.Provider>
  );
};
