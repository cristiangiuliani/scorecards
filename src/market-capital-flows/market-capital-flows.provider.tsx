import { useState, type ReactNode } from 'react';

import type { IMarketCapitalFlowsProvider } from '../interfaces/market-capital-flows';

import MarketCapitalFlowsContext from './market-capital-flows.context';

export const MarketCapitalFlowsProvider = ({ children }: { children: ReactNode }) => {
  const marketCapitalFlowsProviderValue: IMarketCapitalFlowsProvider = {
    isLoadingCapitalFlows: false,
    fedBalanceSheet: undefined,
    m2MoneySupply: undefined,
    dollarIndex: undefined,
    highYieldSpread: undefined,
    goldPrice: undefined,
    stablecoinMarketCap: undefined,
    totalCryptoMarketCap: undefined,
    stablecoinDominance: undefined,
    refetchMarketCapitalFlowsData: () => {},
  };

  const [marketCapitalFlows, setMarketCapitalFlows] = useState<IMarketCapitalFlowsProvider>(
    marketCapitalFlowsProviderValue
  );

  const updateMarketCapitalFlows = (
    newState: IMarketCapitalFlowsProvider = marketCapitalFlowsProviderValue
  ) => {
    setMarketCapitalFlows((prevState: IMarketCapitalFlowsProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <MarketCapitalFlowsContext.Provider
      value={{
        ...marketCapitalFlows,
        updateMarketCapitalFlows,
      }}
    >
      {children}
    </MarketCapitalFlowsContext.Provider>
  );
};
