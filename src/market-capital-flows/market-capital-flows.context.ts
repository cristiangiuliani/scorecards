import { createContext } from 'react';

import type { IMarketCapitalFlowsContext } from '../interfaces/market-capital-flows';

const MarketCapitalFlowsContext = createContext<IMarketCapitalFlowsContext>({
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
  updateMarketCapitalFlows: () => {},
});

export default MarketCapitalFlowsContext;
