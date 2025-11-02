import { useState, type ReactNode } from 'react';

import type { IMarketTreasuryBondsProvider } from '../interfaces/market-treasury-bonds';

import MarketTreasuryBondsContext from './market-treasury-bonds.context';

export const MarketTreasuryBondsProvider = ({ children }: { children: ReactNode }) => {
  const marketTreasuryBondsProviderValue: IMarketTreasuryBondsProvider = {
    isLoadingBonds: false,
    yield10Y: undefined,
    yield5Y: undefined,
    yield2Y: undefined,
    yieldCurveSlope: undefined,
    creditSpreads: undefined,
    inflationExpectations: undefined,
    isYield10YLoading: false,
    isYield5YLoading: false,
    isYield2YLoading: false,
    isSpreadsLoading: false,
    isInflationLoading: false,
    cacheCreatedAt: null,
    cacheExpiresAt: null,
    refetchMarketBondsData: () => {},
  };

  const [marketTreasuryBonds, setMarketTreasuryBonds] = useState<IMarketTreasuryBondsProvider>(
    marketTreasuryBondsProviderValue
  );

  const updateMarketTreasuryBonds = (
    newState: IMarketTreasuryBondsProvider = marketTreasuryBondsProviderValue
  ) => {
    setMarketTreasuryBonds((prevState: IMarketTreasuryBondsProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <MarketTreasuryBondsContext.Provider
      value={{
        ...marketTreasuryBonds,
        updateMarketTreasuryBonds,
      }}
    >
      {children}
    </MarketTreasuryBondsContext.Provider>
  );
};
