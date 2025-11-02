import { createContext } from 'react';

import type { IMarketTreasuryBondsContext } from '../interfaces/market-treasury-bonds';

const MarketTreasuryBondsContext = createContext<IMarketTreasuryBondsContext>({
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
  isLoadingBonds: false,
  cacheCreatedAt: null,
  cacheExpiresAt: null,
  refetchMarketBondsData: () => {},
  updateMarketTreasuryBonds: () => {},
});

export default MarketTreasuryBondsContext;
