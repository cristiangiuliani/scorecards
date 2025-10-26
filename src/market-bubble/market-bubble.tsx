import React from 'react';

import MarketBubbleContainer from './market-bubble.container';
import { MarketBubbleProvider } from './market-bubble.provider';

const MarketBubble: React.FC = () => {
  return (
    <MarketBubbleProvider>
      <MarketBubbleContainer />
    </MarketBubbleProvider>
  );
};

export default MarketBubble;
