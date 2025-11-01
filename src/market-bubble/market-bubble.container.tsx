import React, {
  useContext, useEffect,
} from 'react';

import { API } from '../constants/api';
import { NASDAQ_PE_RATIO } from '../constants/config';
import type {

  IFinancialModelingPrepResponse,
  IYahooFinanceResponse,
} from '../interfaces/api-responses';
import type { IMarketBubbleContext } from '../interfaces/market-bubble';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import MarketBubbleComponent from './market-bubble.component';
import MarketBubbleContext from './market-bubble.context';

const MarketBubbleContainer: React.FC = () => {
  const {
    updateMarketBubble = () => {},
  } = useContext<IMarketBubbleContext>(MarketBubbleContext);

  const nvidiaPEData = useNetlifyApi<IFinancialModelingPrepResponse[]>({
    apiFunction: API.peRatioNvda,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const {
      data, loading,
    } = nvidiaPEData || {};
    const result = data || [];
    updateMarketBubble({ isNvidiaPELoading: loading });
    if (result.length > 0) {
      const peRatio = result[0]?.priceToEarningsRatioTTM;
      updateMarketBubble({
        nvidiaPE: parseFloat(peRatio.toString()),
      });
    }
  }, [nvidiaPEData.data]);

  const vixHistoryData = useNetlifyApi<IYahooFinanceResponse>({
    apiFunction: API.vix,
    options: {
      autoFetch: true,
      params: {
        interval: '1d',
        range: '5d',
      },
    },
  });

  useEffect(() => {
    const {
      data, loading, cacheExpiresAt, cacheCreatedAt,
    } = vixHistoryData;
    updateMarketBubble({
      isVixHistoryLoading: loading,
      cacheExpiresAt,
      cacheCreatedAt,
    });
    if (data) {
      const closeValues = data?.chart?.result[0]?.indicators?.quote[0]?.close || [];
      const cleanedVixHistory = closeValues.filter((value: number | null) =>
        value != null && !isNaN(value) && value > 0
      );

      updateMarketBubble({
        vixHistory: cleanedVixHistory,
      });
    }
  }, [vixHistoryData.data, vixHistoryData.cacheExpiresAt, vixHistoryData.cacheCreatedAt]);

  useEffect(() => {
    updateMarketBubble({
      nasdaqPE: NASDAQ_PE_RATIO.value,
      refetchMarketBubbleData: () => {
        vixHistoryData.forceRefresh();
        nvidiaPEData.forceRefresh();
      },
    });
  }, []);

  return (
    <MarketBubbleComponent />
  );
};

export default MarketBubbleContainer;
