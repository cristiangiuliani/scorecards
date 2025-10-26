import {
  useState, type ReactNode,
} from 'react';

import type { IMarketBubbleProvider } from '../interfaces/market-bubble';

import MarketBubbleContext from './market-bubble.context';

export const MarketBubbleProvider = ({
  children,
}: { children: ReactNode }) => {
  const marketBubbleProviderValue = {
    vixHistory: undefined,
    nvidiaPE: undefined,
    nasdaqPE: undefined,
    isNvidiaPELoading: false,
    isNasdaqPELoading: false,
    isLoadingBubble: false,
    isVixHistoryLoading: false,
    refetchMarketBubbleData: () => {},
  };
  const [marketBubble, setMarketBubble] = useState<IMarketBubbleProvider>(marketBubbleProviderValue);

  const updateMarketBubble = (newState: IMarketBubbleProvider = marketBubbleProviderValue) => {
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
