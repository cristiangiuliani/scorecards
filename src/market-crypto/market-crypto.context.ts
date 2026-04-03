import {
  createContext,
} from 'react';

import type {
  IMarketCryptoContext,
  IMarketCryptoProvider,
} from '../interfaces/market-crypto';

export const MARKET_CRYPTO_INITIAL_STATE: IMarketCryptoProvider = {
  isLoadingCrypto: false,
  btcFearGreed: undefined,
  btcDominance: undefined,
  currentPrice: undefined,
  ath: undefined,
  prices: undefined,
  volumes: undefined,
  isBtcLoading: false,
  isBtcDominanceLoading: false,
  isBtcRsiLoading: false,
  isBtcFearGreedLoading: false,
  refetchMarketCryptoData: () => {},
};

const MarketCryptoContext = createContext<IMarketCryptoContext>({
  ...MARKET_CRYPTO_INITIAL_STATE,
  updateMarketCrypto: () => {},
});

export default MarketCryptoContext;
