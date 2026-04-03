import {
  useState, type ReactNode,
} from 'react';

import type { IMarketBubbleProvider } from '../interfaces/market-bubble';

import MarketBubbleContext, { MARKET_BUBBLE_INITIAL_STATE } from './market-bubble.context';

export const MarketBubbleProvider = ({
  children,
}: { children: ReactNode }) => {
  const [marketBubble, setMarketBubble] = useState<IMarketBubbleProvider>(MARKET_BUBBLE_INITIAL_STATE);

  const updateMarketBubble = (newState: IMarketBubbleProvider = MARKET_BUBBLE_INITIAL_STATE) => {
    setMarketBubble((prevState: IMarketBubbleProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <MarketBubbleContext.Provider value={{
      ...marketBubble,
      updateMarketBubble,
    }}
    >
      { children }
    </MarketBubbleContext.Provider>
  );
};
