import {
  createContext,
} from 'react';

import type { IMarketCryptoContext } from '../interfaces/market-crypto';

const MarketCryptoContext = createContext<IMarketCryptoContext>({
  isLoadingCrypto: false,
  btcFearGreed: undefined,
  btcDominance: undefined,
  lastUpdated: undefined,
  refetchMarketCryptoData: () => {},
  updateMarketCrypto: () => {},
});

export default MarketCryptoContext;
