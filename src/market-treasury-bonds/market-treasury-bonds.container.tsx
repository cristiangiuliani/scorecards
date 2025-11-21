import React, { useContext, useEffect } from 'react';

import { API } from '../constants/api';
import type { IFREDResponse } from '../interfaces/api-responses';
import type { IMarketTreasuryBondsContext } from '../interfaces/market-treasury-bonds';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import MarketTreasuryBondsComponent from './market-treasury-bonds.component';
import MarketTreasuryBondsContext from './market-treasury-bonds.context';

const MarketTreasuryBondsContainer: React.FC = () => {
  const { updateMarketTreasuryBonds = () => {} } = useContext<IMarketTreasuryBondsContext>(
    MarketTreasuryBondsContext
  );

  // Fetch 10Y Treasury Yield from FRED (DGS10)
  const yield10YData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredDGS10,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const {
      data, loading, cacheExpiresAt, cacheCreatedAt,
    } = yield10YData || {};
    updateMarketTreasuryBonds({
      isYield10YLoading: loading,
      cacheExpiresAt,
      cacheCreatedAt,
    });
    if (data?.observations && data.observations.length > 0) {
      const latestObservation = data.observations[0];
      updateMarketTreasuryBonds({
        yield10Y: parseFloat(latestObservation.value),
      });
    }
  }, [yield10YData.data, yield10YData.cacheExpiresAt, yield10YData.cacheCreatedAt]);

  // Fetch 5Y Treasury Yield from FRED (DGS5)
  const yield5YData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredDGS5,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = yield5YData;
    updateMarketTreasuryBonds({ isYield5YLoading: loading });
    if (data?.observations && data.observations.length > 0) {
      const latestObservation = data.observations[0];
      updateMarketTreasuryBonds({
        yield5Y: parseFloat(latestObservation.value),
      });
    }
  }, [yield5YData.data]);

  // Fetch 2Y Treasury Yield from FRED (DGS2)
  const yield2YData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredDGS2,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = yield2YData;
    updateMarketTreasuryBonds({ isYield2YLoading: loading });
    if (data?.observations && data.observations.length > 0) {
      const latestObservation = data.observations[0];
      updateMarketTreasuryBonds({
        yield2Y: parseFloat(latestObservation.value),
      });
    }
  }, [yield2YData.data]);

  // Fetch Credit Spreads from FRED (BAMLC0A0CM)
  const creditSpreadsData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredBAML,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = creditSpreadsData;
    updateMarketTreasuryBonds({ isSpreadsLoading: loading });
    if (data?.observations && data.observations.length > 0) {
      const latestObservation = data.observations[0];
      // FRED returns percentage, convert to basis points (multiply by 100)
      updateMarketTreasuryBonds({
        creditSpreads: parseFloat(latestObservation.value) * 100,
      });
    }
  }, [creditSpreadsData.data]);

  // Fetch Inflation Expectations from FRED (T10YIE)
  const inflationData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredT10YIE,
    options: {
      autoFetch: true,
    },
  });

  useEffect(() => {
    const { data, loading } = inflationData;
    updateMarketTreasuryBonds({ isInflationLoading: loading });
    if (data?.observations && data.observations.length > 0) {
      const latestObservation = data.observations[0];
      updateMarketTreasuryBonds({
        inflationExpectations: parseFloat(latestObservation.value),
      });
    }
  }, [inflationData.data]);

  // Setup refetch function
  useEffect(() => {
    updateMarketTreasuryBonds({
      refetchMarketBondsData: () => {
        yield10YData.forceRefresh();
        yield5YData.forceRefresh();
        yield2YData.forceRefresh();
        creditSpreadsData.forceRefresh();
        inflationData.forceRefresh();
      },
    });
  }, []);

  return <MarketTreasuryBondsComponent />;
};

export default MarketTreasuryBondsContainer;
