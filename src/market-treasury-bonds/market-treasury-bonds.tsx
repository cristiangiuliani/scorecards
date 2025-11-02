import React from 'react';

import MarketTreasuryBondsContainer from './market-treasury-bonds.container';
import { MarketTreasuryBondsProvider } from './market-treasury-bonds.provider';

const MarketTreasuryBonds: React.FC = () => {
  return (
    <MarketTreasuryBondsProvider>
      <MarketTreasuryBondsContainer />
    </MarketTreasuryBondsProvider>
  );
};

export default MarketTreasuryBonds;
