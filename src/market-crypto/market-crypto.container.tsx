import React, {
  useContext, useEffect, useRef,
} from 'react';
import { RSI } from 'technicalindicators';

import btcMock from '../_mocks/btc.json';
import btcDominanceMock from '../_mocks/btcDominance.json';
import btcFearGreedMock from '../_mocks/btcFearGreed.json';
import btcRsiMock from '../_mocks/btcRsi.json';
import { Urls } from '../enums/global';
import type { IMarketCryptoContext } from '../interfaces/market-crypto';

import MarketCryptoComponent from './market-crypto.component';
import MarketCryptoContext from './market-crypto.context';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA  === 'true';

const MarketCryptoContainer: React.FC = () => {
  const {
    updateMarketCrypto = () => {},
  } = useContext<IMarketCryptoContext>(MarketCryptoContext);

  const skipStrictModeRerender = useRef(false);

  const fetchBtcData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${Urls.ApiBaseUrl}/fetchBtc`);
        data = await res.json();
      } else {
        data = btcMock;
      }
      updateMarketCrypto({
        currentPrice: data?.data?.market_data.current_price.usd,
        ath: data?.data?.market_data.ath.usd,
      });
    } catch (err) {
      console.error('Error fetching Btc dominance:', err);
    }
  };

  const fetchBtcDominanceData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${Urls.ApiBaseUrl}/fetchBtcDominance`);
        data = await res.json();
      } else {
        data = btcDominanceMock;
      }
      const btcDominanceValue = parseFloat(data?.data?.market_cap_percentage?.btc?.toFixed(2));
      const altcoinSeasonIndexValue = Math.max(0, Math.min(100,
        ((70 - btcDominanceValue) / 30) * 100
      ));
      updateMarketCrypto({
        btcDominance: btcDominanceValue,
        altcoinSeasonIndex: altcoinSeasonIndexValue,
      });
    } catch (err) {
      console.error('Error fetching Btc dominance:', err);
    }
  };

  const fetchBtcRsiData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${Urls.ApiBaseUrl}/fetchBtcRsi`);
        data = await res.json();
      } else {
        data = btcRsiMock;
      }
      const pricesValues = data?.prices.map(([_, price]:number[]) => price);

      const rsiValues = RSI.calculate({
        values: pricesValues,
        period: 14,
      });

      updateMarketCrypto({
        btcRsi: rsiValues[rsiValues.length - 1],
        prices: pricesValues,
        volumes: data?.data?.total_volumes.map(([_, volume]:number[]) => volume),
      });
    } catch (err) {
      console.error('Error fetching Btc RSI:', err);
    }
  };

  const fetchBtcFearGreedData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${Urls.ApiBaseUrl}/fetchBtcFearGreed`);
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
