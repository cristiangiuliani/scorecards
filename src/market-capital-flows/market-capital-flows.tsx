import React from 'react';

import MarketCapitalFlowsContainer from './market-capital-flows.container';
import { MarketCapitalFlowsProvider } from './market-capital-flows.provider';

const MarketCapitalFlows: React.FC = () => {
  return (
    <MarketCapitalFlowsProvider>
      <MarketCapitalFlowsContainer />
    </MarketCapitalFlowsProvider>
  );
};

export default MarketCapitalFlows;
