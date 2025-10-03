import React from 'react';

import MarketCryptoContainer from './market-crypto.container';
import { MarketCryptoProvider } from './market-crypto.provider';

const MarketCrypto: React.FC = () => {
  return (
    <MarketCryptoProvider>
      <MarketCryptoContainer />
    </MarketCryptoProvider>
  );
};

export default MarketCrypto;
