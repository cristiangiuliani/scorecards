import { createContext } from 'react';

import type {
  IMarketCapitalFlowsContext,
  IMarketCapitalFlowsProvider,
} from '../interfaces/market-capital-flows';

export const MARKET_CAPITAL_FLOWS_INITIAL_STATE: IMarketCapitalFlowsProvider = {
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

const MarketCapitalFlowsContext = createContext<IMarketCapitalFlowsContext>({
  ...MARKET_CAPITAL_FLOWS_INITIAL_STATE,
  updateMarketCapitalFlows: () => {},
});

export default MarketCapitalFlowsContext;
