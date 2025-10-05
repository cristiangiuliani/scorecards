import React, {
  useContext, useEffect, useRef,
} from 'react';

import eurUsdMock from '../_mocks/eurUsd.json';
import fearGreedMock from '../_mocks/fearGreed.json';
import rsiSP500Mock from '../_mocks/rsiSp500.json';
import sp500Mock from '../_mocks/sp500.json';
import vixMock from '../_mocks/vix.json';
import { GLOBALS } from '../constants/config';
import type { IMarketStocksContext } from '../interfaces/market-stocks';

import MarketStocksComponent from './market-stocks.component';
import MarketStocksContext from './market-stocks.context';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA  === 'true';
const MarketStocksContainer: React.FC = () => {
  const {
    updateMarketStocks = () => {},
  } = useContext<IMarketStocksContext>(MarketStocksContext);

  const skipStrictModeRerender = useRef(false);

  const fetchSP500Data = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchSP500`);
        data = await res.json();
      } else {
        data = sp500Mock;
      }
      const sp500Quotes = data?.chart?.result[0]?.indicators?.quote || [];
      updateMarketStocks({
        sp500Price: parseFloat(data?.chart?.result[0]?.meta.regularMarketPrice),
        sp500Prices: data?.chart?.result[0]?.indicators.quote[0].close,
        sp500Volumes: data?.chart?.result[0]?.indicators.quote[0].volume,
        sp500ATH: sp500Quotes.length > 0 ? Math.max(...sp500Quotes[0].close) : undefined,
        treasury10Y: data?.chart?.result[0]?.meta?.regularMarketPrice,

      });
    } catch (err) {
      console.error('Error fetching VIX:', err);
    }
  };

  const fetchVixData = async () => {
    try {
      let data;
      if (!USE_MOCK_DATA) {
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchVix`);
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
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchRsiSP500`);
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
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchEurUsd`);
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
        const res = await fetch(`${GLOBALS.ApiBaseUrl}/fetchFearGreed`);
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
    fetchSP500Data();
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
