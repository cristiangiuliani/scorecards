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

  const fetchRealData = async () => {
    try {
      const BASE_URL = import.meta.env.FUNCTIONS_BASE_URL;
      const res = await fetch(`${BASE_URL}/fetchVix`); // se usi il proxy Vite
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error('Errore fetching VIX:', err);
    }
    // const ALPHA_VANTAGE_KEY = 'A7NSCWJERBK5VUXC'; // Replace with your Alpha Vantage API key
    // try {
    // // VIX from Yahoo Finance
    //   const vixResponse = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX');
    //   const vixData = await vixResponse.json();
    //   const vix = vixData.chart.result[0].meta.regularMarketPrice;

    //   // EUR/USD from Alpha Vantage
    //   const fxResponse = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=A7NSCWJERBK5VUXC`);
    //   const fxData = await fxResponse.json();
    //   const eurUsd = parseFloat(fxData['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    //   console.log('Fetched VIX:', vix, 'EUR/USD:', eurUsd);
    //   return {
    //     vix,
    //     eurUsd,
    //   };
    // } catch (error) {
    //   console.error('Error fetching traditional data:', error);
    // }
  };

  const fetchMarketData = async () => {
    updateDashboard({ isLoading: true });

    let mockStockData:TStocksData, mockCryptoData:TCryptoData;
    fetchRealData();
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
