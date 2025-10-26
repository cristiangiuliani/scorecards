import {
  createContext,
} from 'react';

import type { IMarketBubbleContext } from '../interfaces/market-bubble';

const MarketBubbleContext = createContext<IMarketBubbleContext>({
  vixHistory: undefined,
  nvidiaPE: undefined,
  nasdaqPE: undefined,
  isNvidiaPELoading: false,
  isNasdaqPELoading: false,
  isLoadingBubble: false,
  isVixHistoryLoading: false,

  refetchMarketBubbleData: () => {},
  updateMarketBubble: () => {},
});

export default MarketBubbleContext;
