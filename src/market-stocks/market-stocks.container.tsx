import React, {
  useContext, useEffect,
} from 'react';
import { RSI } from 'technicalindicators';

import { API } from '../constants/api';
import { STOCKS_SCOPE } from '../constants/config';
import type {
  IAlphaVantageCurrencyResponse,
  IFearGreedResponse,
  IYahooFinanceResponse,
} from '../interfaces/api-responses';
import type { IMarketStocksContext } from '../interfaces/market-stocks';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import MarketStocksComponent from './market-stocks.component';
import MarketStocksContext from './market-stocks.context';

const MarketStocksContainer: React.FC = () => {
  const {
    updateMarketStocks = () => {},
  } = useContext<IMarketStocksContext>(MarketStocksContext);

  const sp500Data = useNetlifyApi<IYahooFinanceResponse>({
    apiFunction: API.sp500,
    options: {
      autoFetch: true,
      params: {
        days: STOCKS_SCOPE.lookbackDays.toString(),
      },
    },
  });

  useEffect(() => {
    const {
      data, loading, cacheExpiresAt, cacheCreatedAt,
    } = sp500Data || {};
    const result = data?.chart?.result || [];
    updateMarketStocks({
      isSp500Loading: loading,
      cacheExpiresAt,
      cacheCreatedAt,
    });

    if (result.length > 0) {
      const sp500Quotes = result[0]?.indicators?.quote || [];
      updateMarketStocks({
        sp500Price: parseFloat(result[0]?.meta?.regularMarketPrice?.toString()),
        sp500Prices: result[0]?.indicators?.quote[0]?.close,
        sp500Volumes: result[0]?.indicators?.quote[0]?.volume,
        sp500ATH: sp500Quotes.length > 0 ? Math.max(...sp500Quotes[0].close) : undefined,
        treasury10Y: result[0]?.meta?.regularMarketPrice,
      });
    }
  }, [sp500Data.data, sp500Data.cacheExpiresAt, sp500Data.cacheCreatedAt]);

  const vixData = useNetlifyApi<IYahooFinanceResponse>({
    apiFunction: API.vix,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = vixData;
    updateMarketStocks({ isVixLoading: loading });
    if (data) {
      updateMarketStocks({
        vix: parseFloat(data?.chart?.result[0]?.meta?.regularMarketPrice?.toString()),
      });
    }
  }, [vixData.data]);

  const rsiData = useNetlifyApi<IYahooFinanceResponse>({
    apiFunction: API.rsiSP500,
    options: {
      autoFetch: true,
      params: {
        days: '30', // Need at least 14 days + buffer for RSI calculation
      },
    },
  });

  useEffect(() => {
    const { data, loading } = rsiData;
    updateMarketStocks({ isRsiLoading: loading });
    if (data) {
      const result = data?.chart?.result || [];
      if (result.length > 0) {
        const closePrices = result[0]?.indicators?.quote[0]?.close || [];

        // Calculate RSI client-side like BTC RSI
        const rsiValues = RSI.calculate({
          values: closePrices,
          period: 14,
        });

        const lastRsi = rsiValues?.length > 0 ? rsiValues[rsiValues.length - 1] : 0;

        updateMarketStocks({
          rsiSP500: lastRsi,
        });
      }
    }
  }, [rsiData.data]);

  const eurUsdData = useNetlifyApi<IAlphaVantageCurrencyResponse>({
    apiFunction: API.eurUsd,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = eurUsdData;
    updateMarketStocks({ isEurUsdLoading: loading });
    if (data) {
      updateMarketStocks({
        eurUsd: parseFloat(data['Realtime Currency Exchange Rate']?.['5. Exchange Rate']),
      });
    }
  }, [eurUsdData.data]);

  const fearGreedData = useNetlifyApi<IFearGreedResponse>({
    apiFunction: API.fearGreed,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = fearGreedData;
    updateMarketStocks({ isFearGreedLoading: loading });
    if (data) {
      updateMarketStocks({
        fearGreed: parseFloat(data.fear_and_greed?.score?.toString()),
      });
    }
  }, [fearGreedData.data]);

  useEffect(() => {
    updateMarketStocks({
      refetchMarketStocksData: () => {
        vixData.forceRefresh();
        rsiData.forceRefresh();
        eurUsdData.forceRefresh();
        fearGreedData.forceRefresh();
        sp500Data.forceRefresh();
      },
    });
  }, []);

  return (
    <MarketStocksComponent />
  );
};

export default MarketStocksContainer;
