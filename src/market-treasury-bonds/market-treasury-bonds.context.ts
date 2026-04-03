import { createContext } from 'react';

import type {
  IMarketTreasuryBondsContext,
  IMarketTreasuryBondsProvider,
} from '../interfaces/market-treasury-bonds';

export const MARKET_TREASURY_BONDS_INITIAL_STATE: IMarketTreasuryBondsProvider = {
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

const MarketTreasuryBondsContext = createContext<IMarketTreasuryBondsContext>({
  ...MARKET_TREASURY_BONDS_INITIAL_STATE,
  updateMarketTreasuryBonds: () => {},
});

export default MarketTreasuryBondsContext;
