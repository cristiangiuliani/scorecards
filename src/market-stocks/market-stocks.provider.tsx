import {
  useState, type ReactNode,
} from 'react';

import type { IMarketStocksProvider } from '../interfaces/market-stocks';

import MarketStocksContext from './market-stocks.context';

export const MarketStocksProvider = ({
  children,
}: { children: ReactNode }) => {
  const marketStocksProviderValue = {
    isLoadingStocks: false,
    vix: undefined,
    rsiSP500: undefined,
    eurUsd: undefined,
    fearGreed: undefined,
    lastUpdated: undefined,
    refetchMarketStocksData: () => {},
  };
  const [marketStocks, setMarketStocks] = useState<IMarketStocksProvider>(marketStocksProviderValue);

  const updateMarketStocks = (newState: IMarketStocksProvider = marketStocksProviderValue) => {
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
