import React, {
  useContext, useEffect,
} from 'react';

import { API } from '../constants/api';
import { CRYPTO_SCOPES } from '../constants/config';
import type { IMarketCryptoContext } from '../interfaces/market-crypto';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import MarketCryptoComponent from './market-crypto.component';
import MarketCryptoContext from './market-crypto.context';

const MarketCryptoContainer: React.FC = () => {
  const {
    updateMarketCrypto = () => {},
  } = useContext<IMarketCryptoContext>(MarketCryptoContext);

  const btcData = useNetlifyApi({
    apiFunction: API.btc,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data } = btcData;

    if (data) {
      updateMarketCrypto({
        currentPrice: data?.market_data.current_price.usd,
        ath: data?.market_data.ath.usd,
      });
    }
  }, [btcData.data]);

  const btcDominanceData = useNetlifyApi({
    apiFunction: API.btcDominance,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data } = btcDominanceData;

    if (data) {
      updateMarketCrypto({
        btcDominance: parseFloat(data?.data?.market_cap_percentage?.btc?.toFixed(2)),
      });
    }
  }, [btcDominanceData.data]);

  const btcRsiData = useNetlifyApi({
    apiFunction: API.btcRsi,
    options: {
      autoFetch: true,
      params: {
        days: CRYPTO_SCOPES.lookbackDays.toString(),
      },
    },
  });

  useEffect(() => {
    const { data } = btcRsiData;

    if (data) {
      updateMarketCrypto({
        prices: data?.prices.map(([_, price]:number[]) => price),
        volumes: data?.data?.total_volumes.map(([_, volume]:number[]) => volume),
      });
    }
  }, [btcRsiData.data]);

  const btcFearGreedData = useNetlifyApi({
    apiFunction: API.btcFearGreed,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data } = btcFearGreedData;

    if (data) {
      updateMarketCrypto({
        btcFearGreed: parseFloat(data.data[0].value),
      });
    }
  }, [btcFearGreedData.data]);

  useEffect(() => {
    updateMarketCrypto({ lastUpdated: new Date().toISOString() });
  }, []);

  return (
    <MarketCryptoComponent />
  );
};

export default MarketCryptoContainer;
