import {
  useState, type ReactNode,
} from 'react';

import type { IMarketCryptoProvider } from '../interfaces/market-crypto';

import MarketCryptoContext, { MARKET_CRYPTO_INITIAL_STATE } from './market-crypto.context';

export const MarketCryptoProvider = ({
  children,
}: { children: ReactNode }) => {
  const [marketCrypto, setMarketCrypto] = useState<IMarketCryptoProvider>(MARKET_CRYPTO_INITIAL_STATE);

  const updateMarketCrypto = (newState: IMarketCryptoProvider = MARKET_CRYPTO_INITIAL_STATE) => {
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
