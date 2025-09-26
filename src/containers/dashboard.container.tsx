import React, { useContext, useEffect } from 'react';

import DashboardContext from '../context/dashboard.context';
import { MarketIndexValues } from '../enums/market-indexes';
import type { IDashboardContext } from '../interfaces/dashboard';
import DashboardLayout from '../layouts/dashboard.layout';
import type { TCryptoData, TStocksData } from '../types/data.type';

const DashboardContainer: React.FC = () => {
  const {
    updateDashboard = () => {},
  } = useContext<IDashboardContext>(DashboardContext);
  const {
    isLoading, stocksData, cryptoData,
  } = useContext<IDashboardContext>(DashboardContext);

  const fetchMarketData = async () => {
    updateDashboard({ isLoading: true });
    let mockStockData:TStocksData, mockCryptoData:TCryptoData;
    setTimeout(() => {
      mockStockData = {
        vix: MarketIndexValues.Vix + (Math.random() - 0.5) * 2,
        rsiSP500: MarketIndexValues.RsiSP500 + (Math.random() - 0.5) * 5,
        eurUsd: MarketIndexValues.EurUsd + (Math.random() - 0.5) * 0.02,
        fearGreed: Math.max(0, Math.min(100, MarketIndexValues.FearGreed + (Math.random() - 0.5) * 10)),
        lastUpdated: new Date().toISOString(),
      };

      mockCryptoData = {
        btcFearGreed: Math.max(0, Math.min(100, MarketIndexValues.BtcFearGreed + (Math.random() - 0.5) * 15)),
        btcRsi: Math.max(0, Math.min(100, MarketIndexValues.BtcRsi + (Math.random() - 0.5) * 10)),
        btcDominance: MarketIndexValues.BtcDominance + (Math.random() - 0.5) * 2,
        altSeasonIndex: Math.max(0, Math.min(100, MarketIndexValues.AltSeasonIndex + (Math.random() - 0.5) * 15)),
        lastUpdated: new Date().toISOString(),
      };
      updateDashboard({
        isLoading: false,
        stocksData: mockStockData,
        cryptoData: mockCryptoData,
      });
    }, 2000);
  };

  useEffect(() => {
    if (!isLoading && (!stocksData || !cryptoData)) {
      fetchMarketData();
      updateDashboard({
        refetchMarketData: fetchMarketData,
      });
    }
  }, [isLoading, stocksData, cryptoData, fetchMarketData]);
  return (
    <DashboardLayout />
  );
};

export default DashboardContainer;
