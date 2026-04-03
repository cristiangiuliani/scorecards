import {
  createContext,
} from 'react';

import type {
  IMarketBubbleContext,
  IMarketBubbleProvider,
} from '../interfaces/market-bubble';

export const MARKET_BUBBLE_INITIAL_STATE: IMarketBubbleProvider = {
  isLoadingBubble: false,
  vixHistory: undefined,
  nvidiaPE: undefined,
  nasdaqPE: undefined,
  fearGreed: undefined,
  rsiSP500: undefined,
  isNvidiaPELoading: false,
  isNasdaqPELoading: false,
  isVixHistoryLoading: false,
  isFearGreedLoading: false,
  isRsiLoading: false,
  refetchMarketBubbleData: () => {},
};

const MarketBubbleContext = createContext<IMarketBubbleContext>({
  ...MARKET_BUBBLE_INITIAL_STATE,
  updateMarketBubble: () => {},
});

export default MarketBubbleContext;
