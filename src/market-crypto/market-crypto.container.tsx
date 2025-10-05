import React, {
  useContext, useEffect, useRef,
} from 'react';

import btcMock from '../_mocks/btc.json';
import btcDominanceMock from '../_mocks/btcDominance.json';
import btcFearGreedMock from '../_mocks/btcFearGreed.json';
import btcRsiMock from '../_mocks/btcRsi.json';
import { CRYPTO_SCOPES, GLOBALS } from '../constants/config';
import DashboardContext from '../dashboard/dashboard.context';
import type { IDashboardContext } from '../interfaces/dashboard';
import type { IMarketCryptoContext } from '../interfaces/market-crypto';

import MarketCryptoComponent from './market-crypto.component';
import MarketCryptoContext from './market-crypto.context';

const MarketCryptoContainer: React.FC = () => {
  const { isDemo } = useContext<IDashboardContext>(DashboardContext);
  const {
    updateMarketCrypto = () => {},
  } = useContext<IMarketCryptoContext>(MarketCryptoContext);

  const skipStrictModeRerender = useRef(false);

  const fetchBtcData = async () => {
    try {
      let data;
      if (!isDemo) {
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchBtc`);
        data = await res.json();
      } else {
        data = btcMock;
      }
      console.log(data?.market_data.current_price.usd);

      updateMarketCrypto({
        currentPrice: data?.market_data.current_price.usd,
        ath: data?.market_data.ath.usd,
      });
    } catch (err) {
      console.error('Error fetching Btc dominance:', err);
    }
  };

  const fetchBtcDominanceData = async () => {
    try {
      let data;
      if (!isDemo) {
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchBtcDominance`);
        data = await res.json();
      } else {
        data = btcDominanceMock;
      }

      updateMarketCrypto({
        btcDominance: parseFloat(data?.data?.market_cap_percentage?.btc?.toFixed(2)),
      });
    } catch (err) {
      console.error('Error fetching Btc dominance:', err);
    }
  };

  const fetchBtcRsiData = async () => {
    try {
      let data;
      if (!isDemo) {
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchBtcRsi?days=${CRYPTO_SCOPES.lookbackDays}`);
        data = await res.json();
      } else {
        data = btcRsiMock;
      }

      updateMarketCrypto({
        prices: data?.prices.map(([_, price]:number[]) => price),
        volumes: data?.data?.total_volumes.map(([_, volume]:number[]) => volume),
      });
    } catch (err) {
      console.error('Error fetching Btc RSI:', err);
    }
  };

  const fetchBtcFearGreedData = async () => {
    try {
      let data;
      if (!isDemo) {
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchBtcFearGreed`);
        data = await res.json();
      } else {
        data = btcFearGreedMock;
      }

      updateMarketCrypto({
        btcFearGreed: parseFloat(data.data[0].value),
      });
    } catch (err) {
      console.error('Error fetching Btc Fear and Greed:', err);
    }
  };

  useEffect(() => {
    // Avoid dev double call in Strict Mode to not double fetch real data (limited free plan 25 calls per day)
    if (skipStrictModeRerender.current) return;
    skipStrictModeRerender.current = true;
    fetchBtcData();
    fetchBtcDominanceData();
    fetchBtcRsiData();
    fetchBtcFearGreedData();
    updateMarketCrypto({ lastUpdated: new Date().toISOString() });
  }, []);

  return (
    <MarketCryptoComponent />
  );
};

export default MarketCryptoContainer;
