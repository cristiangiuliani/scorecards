import React, {
  useContext, useEffect,
} from 'react';

import { API } from '../constants/api';
import { CRYPTO_SCOPES } from '../constants/config';
import type {
  IBitcoinDominanceResponse,
  IBitcoinFearGreedResponse,
  IBitcoinResponse,
  IBitcoinRSIResponse,
} from '../interfaces/api-responses';
import type { IMarketCryptoContext } from '../interfaces/market-crypto';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import MarketCryptoComponent from './market-crypto.component';
import MarketCryptoContext from './market-crypto.context';

const MarketCryptoContainer: React.FC = () => {
  const {
    updateMarketCrypto = () => {},
  } = useContext<IMarketCryptoContext>(MarketCryptoContext);

  const btcData = useNetlifyApi<IBitcoinResponse>({
    apiFunction: API.btc,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const {
      data, loading, cacheExpiresAt, cacheCreatedAt,
    } = btcData;
    updateMarketCrypto({ isBtcLoading: loading });

    if (data) {
      updateMarketCrypto({
        currentPrice: data?.market_data.current_price.usd,
        ath: data?.market_data.ath.usd,
        cacheExpiresAt,
        cacheCreatedAt,
      });
    }
  }, [btcData.data, btcData.cacheExpiresAt, btcData.cacheCreatedAt]);

  const btcDominanceData = useNetlifyApi<IBitcoinDominanceResponse>({
    apiFunction: API.btcDominance,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = btcDominanceData;
    updateMarketCrypto({ isBtcDominanceLoading: loading });

    if (data) {
      updateMarketCrypto({
        btcDominance: parseFloat(data?.data?.market_cap_percentage?.btc?.toFixed(2)),
      });
    }
  }, [btcDominanceData.data]);

  const btcRsiData = useNetlifyApi<IBitcoinRSIResponse>({
    apiFunction: API.btcRsi,
    options: {
      autoFetch: true,
      params: {
        days: CRYPTO_SCOPES.lookbackDays.toString(),
      },
    },
  });

  useEffect(() => {
    const { data, loading } = btcRsiData;
    updateMarketCrypto({ isBtcRsiLoading: loading });

    if (data) {
      updateMarketCrypto({
        prices: data?.prices.map(([_, price]:number[]) => price),
        volumes: data?.data?.total_volumes.map(([_, volume]:number[]) => volume),
      });
    }
  }, [btcRsiData.data]);

  const btcFearGreedData = useNetlifyApi<IBitcoinFearGreedResponse>({
    apiFunction: API.btcFearGreed,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = btcFearGreedData;
    updateMarketCrypto({ isBtcFearGreedLoading: loading });

    if (data) {
      updateMarketCrypto({
        btcFearGreed: parseFloat(data.data[0].value),
      });
    }
  }, [btcFearGreedData.data]);

  useEffect(() => {
    updateMarketCrypto({
      refetchMarketCryptoData: () => {
        btcData.forceRefresh();
        btcDominanceData.forceRefresh();
        btcRsiData.forceRefresh();
        btcFearGreedData.forceRefresh();
      },
    });
  }, []);

  return (
    <MarketCryptoComponent />
  );
};

export default MarketCryptoContainer;
