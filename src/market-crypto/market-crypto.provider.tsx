import {
  useState, type ReactNode,
} from 'react';

import type { IMarketCryptoProvider } from '../interfaces/market-crypto';

import MarketCryptoContext from './market-crypto.context';

export const MarketCryptoProvider = ({
  children,
}: { children: ReactNode }) => {
  const marketCryptoProviderValue = {
    isLoadingCrypto: false,
    btcFearGreed: undefined,
    btcDominance: undefined,
    currentPrice: undefined,
    ath: undefined,
    prices: undefined,
    volumes: undefined,
    lastUpdated: undefined,
    refetchMarketCryptoData: () => {},
  };
  const [marketCrypto, setMarketCrypto] = useState<IMarketCryptoProvider>(marketCryptoProviderValue);

  const updateMarketCrypto = (newState: IMarketCryptoProvider = marketCryptoProviderValue) => {
    setMarketCrypto((prevState: IMarketCryptoProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <MarketCryptoContext.Provider value={{
      ...marketCrypto,
      updateMarketCrypto,
    }}
    >
      { children }
    </MarketCryptoContext.Provider>
  );
};
