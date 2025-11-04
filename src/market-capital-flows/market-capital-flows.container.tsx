import React, { useContext, useEffect } from 'react';

import { API } from '../constants/api';
import type { IMarketCapitalFlowsContext } from '../interfaces/market-capital-flows';
import { useNetlifyApi } from '../shared/hooks/use-netlify-api';

import MarketCapitalFlowsComponent from './market-capital-flows.component';
import MarketCapitalFlowsContext from './market-capital-flows.context';

interface IFREDResponse {
  observations: Array<{
    date: string;
    value: string;
  }>;
}

interface IStablecoinResponse {
  id: string;
  symbol: string;
  name: string;
  market_cap: number;
}

interface IGlobalCryptoResponse {
  data: {
    total_market_cap: {
      usd: number;
    };
  };
}

const MarketCapitalFlowsContainer: React.FC = () => {
  const { updateMarketCapitalFlows = () => {} } =
    useContext<IMarketCapitalFlowsContext>(MarketCapitalFlowsContext);

  // FRED: Fed Balance Sheet (WALCL)
  const fedBalanceSheetData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredWALCL,
    options: { autoFetch: true },
  });

  useEffect(() => {
    const {
      data, loading, cacheExpiresAt, cacheCreatedAt,
    } = fedBalanceSheetData;
    updateMarketCapitalFlows({
      isFedBalanceSheetLoading: loading,
      cacheExpiresAt,
      cacheCreatedAt,
    });

    if (data?.observations && data.observations.length > 0) {
      const latestValue = parseFloat(data.observations[0].value);
      updateMarketCapitalFlows({ fedBalanceSheet: latestValue });
    }
  }, [fedBalanceSheetData.data, fedBalanceSheetData.cacheExpiresAt, fedBalanceSheetData.cacheCreatedAt]);

  // FRED: M2 Money Supply (WM2NS)
  const m2MoneySupplyData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredM2,
    options: { autoFetch: true },
  });

  useEffect(() => {
    const { data, loading } = m2MoneySupplyData;
    updateMarketCapitalFlows({ isM2MoneySupplyLoading: loading });

    if (data?.observations && data.observations.length > 0) {
      const latestValue = parseFloat(data.observations[0].value);
      updateMarketCapitalFlows({ m2MoneySupply: latestValue });
    }
  }, [m2MoneySupplyData.data]);

  // FRED: Dollar Index (DTWEXBGS)
  const dollarIndexData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredDollarIndex,
    options: { autoFetch: true },
  });

  useEffect(() => {
    const { data, loading } = dollarIndexData;
    updateMarketCapitalFlows({ isDollarIndexLoading: loading });

    if (data?.observations && data.observations.length > 0) {
      const latestValue = parseFloat(data.observations[0].value);
      updateMarketCapitalFlows({ dollarIndex: latestValue });
    }
  }, [dollarIndexData.data]);

  // FRED: High Yield Spread (already exists as fredBAML)
  const highYieldSpreadData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredBAML,
    options: { autoFetch: true },
  });

  useEffect(() => {
    const { data, loading } = highYieldSpreadData;
    updateMarketCapitalFlows({ isHighYieldSpreadLoading: loading });

    if (data?.observations && data.observations.length > 0) {
      const latestValue = parseFloat(data.observations[0].value);
      updateMarketCapitalFlows({ highYieldSpread: latestValue });
    }
  }, [highYieldSpreadData.data]);

  // FRED: Gold Price (GOLDAMGBD228NLBM)
  const goldPriceData = useNetlifyApi<IFREDResponse>({
    apiFunction: API.fredGold,
    options: { autoFetch: true },
  });

  useEffect(() => {
    const { data, loading } = goldPriceData;
    updateMarketCapitalFlows({ isGoldPriceLoading: loading });

    if (data?.observations && data.observations.length > 0) {
      const latestValue = parseFloat(data.observations[0].value);
      updateMarketCapitalFlows({ goldPrice: latestValue });
    }
  }, [goldPriceData.data]);

  // CoinGecko: Stablecoin Market Cap (USDT + USDC)
  const stablecoinsData = useNetlifyApi<IStablecoinResponse[]>({
    apiFunction: API.stablecoins,
    options: { autoFetch: true },
  });

  useEffect(() => {
    const { data, loading } = stablecoinsData;
    updateMarketCapitalFlows({ isStablecoinMarketCapLoading: loading });

    if (data && Array.isArray(data)) {
      const totalStablecoinMcap = data.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
      updateMarketCapitalFlows({ stablecoinMarketCap: totalStablecoinMcap });
    }
  }, [stablecoinsData.data]);

  // CoinGecko: Global Crypto Market Data
  const globalCryptoData = useNetlifyApi<IGlobalCryptoResponse>({
    apiFunction: API.globalCryptoData,
    options: { autoFetch: true },
  });

  useEffect(() => {
    const { data, loading } = globalCryptoData;
    updateMarketCapitalFlows({ isTotalCryptoMarketCapLoading: loading });

    if (data?.data?.total_market_cap?.usd) {
      const totalMcap = data.data.total_market_cap.usd;
      updateMarketCapitalFlows({ totalCryptoMarketCap: totalMcap });
    }
  }, [globalCryptoData.data]);

  // Calculate stablecoin dominance when both values are available
  useEffect(() => {
    const stablecoinMcap = stablecoinsData.data
      ? (stablecoinsData.data as IStablecoinResponse[]).reduce((sum, coin) => sum + (coin.market_cap || 0), 0)
      : 0;
    const totalMcap = globalCryptoData.data?.data?.total_market_cap?.usd || 0;

    if (stablecoinMcap > 0 && totalMcap > 0) {
      const dominance = (stablecoinMcap / totalMcap) * 100;
      updateMarketCapitalFlows({ stablecoinDominance: dominance });
    }
  }, [stablecoinsData.data, globalCryptoData.data]);

  // Setup refetch function
  useEffect(() => {
    updateMarketCapitalFlows({
      refetchMarketCapitalFlowsData: () => {
        fedBalanceSheetData.forceRefresh();
        m2MoneySupplyData.forceRefresh();
        dollarIndexData.forceRefresh();
        highYieldSpreadData.forceRefresh();
        goldPriceData.forceRefresh();
        stablecoinsData.forceRefresh();
        globalCryptoData.forceRefresh();
      },
    });
  }, []);

  return <MarketCapitalFlowsComponent />;
};

export default MarketCapitalFlowsContainer;
