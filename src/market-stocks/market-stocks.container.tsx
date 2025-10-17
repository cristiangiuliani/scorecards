import React, {
  useContext, useEffect,
} from 'react';

import { API } from '../constants/api';
import { STOCKS_SCOPE } from '../constants/config';
import type { IMarketStocksContext } from '../interfaces/market-stocks';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import MarketStocksComponent from './market-stocks.component';
import MarketStocksContext from './market-stocks.context';

const MarketStocksContainer: React.FC = () => {
  const {
    updateMarketStocks = () => {},
  } = useContext<IMarketStocksContext>(MarketStocksContext);

  const sp500Data = useNetlifyApi({
    apiFunction: API.sp500,
    options: {
      autoFetch: true,
      params: {
        days: STOCKS_SCOPE.lookbackDays.toString(),
      },
    },
  });

  useEffect(() => {
    const result = sp500Data?.data?.chart?.result || [];

    if (result.length > 0) {
      const sp500Quotes = result[0]?.indicators?.quote || [];
      updateMarketStocks({
        sp500Price: parseFloat(result[0]?.meta.regularMarketPrice),
        sp500Prices: result[0]?.indicators.quote[0].close,
        sp500Volumes: result[0]?.indicators.quote[0].volume,
        sp500ATH: sp500Quotes.length > 0 ? Math.max(...sp500Quotes[0].close) : undefined,
        treasury10Y: result[0]?.meta?.regularMarketPrice,
      });
    }
  }, [sp500Data.data]);

  const vixData = useNetlifyApi({
    apiFunction: API.vix,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data } = vixData;

    if (data) {
      updateMarketStocks({
        vix: parseFloat(data?.chart?.result[0]?.meta?.regularMarketPrice),
      });
    }
  }, [vixData.data]);

  const rsiData = useNetlifyApi({
    apiFunction: API.rsiSP500,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data } = rsiData;

    if (data) {
      const lastUpdate = data['Meta Data']['3: Last Refreshed'];
      const lastRsi = data['Technical Analysis: RSI'][lastUpdate]['RSI'];
      updateMarketStocks({
        rsiSP500: parseFloat(lastRsi),
      });
    }
  }, [rsiData.data]);

  const eurUsdData = useNetlifyApi({
    apiFunction: API.eurUsd,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data } = eurUsdData;

    if (data) {
      updateMarketStocks({
        eurUsd: parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']),
      });
    }
  }, [eurUsdData.data]);

  const fearGreedData = useNetlifyApi({
    apiFunction: API.fearGreed,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data } = fearGreedData;

    if (data) {
      updateMarketStocks({
        fearGreed: parseFloat(data.fear_and_greed.score),
      });
    }
  }, [fearGreedData.data]);

  useEffect(() => {
    updateMarketStocks({ lastUpdated: new Date().toISOString() });
  }, []);

  return (
    <MarketStocksComponent />
  );
};

export default MarketStocksContainer;
