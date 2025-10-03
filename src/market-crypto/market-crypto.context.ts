import {
  createContext,
} from 'react';

import type { IMarketCryptoContext } from '../interfaces/market-crypto';

const MarketCryptoContext = createContext<IMarketCryptoContext>({
  isLoadingCrypto: false,
  btcFearGreed: undefined,
  btcRsi: undefined,
  btcDominance: undefined,
  altcoinSeasonIndex: undefined,
  lastUpdated: undefined,
  refetchMarketCryptoData: () => {},
  updateMarketCrypto: () => {},
});

export default MarketCryptoContext;
