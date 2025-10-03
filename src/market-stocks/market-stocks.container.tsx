import React, {
  useContext, useEffect, useRef,
} from 'react';

import eurUsdMock from '../_mocks/eurUsd.json';
import fearGreedMock from '../_mocks/fearGreed.json';
import rsiSP500Mock from '../_mocks/rsiSp500.json';
import vixMock from '../_mocks/vix.json';
import type { IMarketStocksContext } from '../interfaces/market-stocks';

import MarketStocksComponent from './market-stocks.component';
import MarketStocksContext from './market-stocks.context';

const BASE_URL = '/scorecards/api'; //import.meta.env.FUNCTIONS_BASE_URL;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA  === 'true';
console.log('USE_MOCK_DATA', import.meta.env.VITE_USE_MOCK_DATA);
const MarketStocksContainer: React.FC = () => {
  const {
    updateMarketStocks = () => {},
    // vix, rsiSP500, eurUsd, fearGreed, lastUpdated,
  } = useContext<IMarketStocksContext>(MarketStocksContext);

  const skipStrictModeRerender = useRef(false);

  const fetchVixData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${BASE_URL}/fetchVix`);
        data = await res.json();
      } else {
        data = vixMock;
      }
      updateMarketStocks({
        vix: parseFloat(data?.chart?.result[0]?.meta?.regularMarketPrice),
      });
    } catch (err) {
      console.error('Error fetching VIX:', err);
    }
  };

  const fetchRsiData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${BASE_URL}/fetchRsiSP500`);
        data = await res.json();
      } else {
        data = rsiSP500Mock;
      }
      const lastUpdate = data['Meta Data']['3: Last Refreshed'];
      const lastRsi = data['Technical Analysis: RSI'][lastUpdate]['RSI'];
      updateMarketStocks({
        rsiSP500: parseFloat(lastRsi),
      });
    } catch (err) {
      console.error('Error fetching RSI S&P 500:', err);
    }
  };

  const fetchUsdData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${BASE_URL}/fetchEurUsd`);
        data = await res.json();
      } else {
        data = eurUsdMock;
      }

      updateMarketStocks({
        eurUsd: parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']),
      });
    } catch (err) {
      console.error('Error fetching USD:', err);
    }
  };

  const fetchFearGreedData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${BASE_URL}/fetchFearGreed`);
        data = await res.json();
      } else {
        data = fearGreedMock;
      }

      updateMarketStocks({
        fearGreed: parseFloat(data.fear_and_greed.score),
      });
    } catch (err) {
      console.error('Error fetching USD:', err);
    }
  };

  useEffect(() => {
    // Avoid dev double call in Strict Mode to not double fetch real data (limited free plan 25 calls per day)
    if (skipStrictModeRerender.current) return;
    skipStrictModeRerender.current = true;
    fetchVixData();
    fetchRsiData();
    fetchUsdData();
    fetchFearGreedData();
    updateMarketStocks({ lastUpdated: new Date().toISOString() });
  }, []);

  return (
    <MarketStocksComponent />
  );
};

export default MarketStocksContainer;
