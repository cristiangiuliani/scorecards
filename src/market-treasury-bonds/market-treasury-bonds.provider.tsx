import { useState, type ReactNode } from 'react';

import type { IMarketTreasuryBondsProvider } from '../interfaces/market-treasury-bonds';

import MarketTreasuryBondsContext, {
  MARKET_TREASURY_BONDS_INITIAL_STATE,
} from './market-treasury-bonds.context';

export const MarketTreasuryBondsProvider = ({ children }: { children: ReactNode }) => {
  const [marketTreasuryBonds, setMarketTreasuryBonds] = useState<IMarketTreasuryBondsProvider>(
    MARKET_TREASURY_BONDS_INITIAL_STATE
  );

  const updateMarketTreasuryBonds = (
    newState: IMarketTreasuryBondsProvider = MARKET_TREASURY_BONDS_INITIAL_STATE
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
