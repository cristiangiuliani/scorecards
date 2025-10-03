import React from 'react';

import MarketStocksContainer from './market-stocks.container';
import { MarketStocksProvider } from './market-stocks.provider';

const MarketStocks: React.FC = () => {
  return (
    <MarketStocksProvider>
      <MarketStocksContainer />
    </MarketStocksProvider>
  );
};

export default MarketStocks;
