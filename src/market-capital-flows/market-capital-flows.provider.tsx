import { useState, type ReactNode } from 'react';

import type { IMarketCapitalFlowsProvider } from '../interfaces/market-capital-flows';

import MarketCapitalFlowsContext, {
  MARKET_CAPITAL_FLOWS_INITIAL_STATE,
} from './market-capital-flows.context';

export const MarketCapitalFlowsProvider = ({ children }: { children: ReactNode }) => {
  const [marketCapitalFlows, setMarketCapitalFlows] = useState<IMarketCapitalFlowsProvider>(
    MARKET_CAPITAL_FLOWS_INITIAL_STATE
  );

  const updateMarketCapitalFlows = (
    newState: IMarketCapitalFlowsProvider = MARKET_CAPITAL_FLOWS_INITIAL_STATE
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
