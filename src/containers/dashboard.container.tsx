import React, {
  useContext, useEffect, useRef,
} from 'react';

import DashboardContext from '../context/dashboard.context';
// import { MarketIndexValues } from '../enums/market-indexes';
import type { IDashboardContext } from '../interfaces/dashboard';
import DashboardLayout from '../layouts/dashboard.layout';
// import type { TCryptoData, TStocksData } from '../types/data.type';

const BASE_URL = '/scorecards/api'; //import.meta.env.FUNCTIONS_BASE_URL;

const DashboardContainer: React.FC = () => {
  const {
    updateDashboard = () => {},
  } = useContext<IDashboardContext>(DashboardContext);
  const {
    stocksData,
  } = useContext<IDashboardContext>(DashboardContext);
  const {
    vix, rsiSP500, eurUsd, fearGreed,
  } = stocksData || {};
  // const [fetchingVix, setFetchingVix] = React.useState(false);
  // const [fetchingRsi, setFetchingRsi] = React.useState(false);
  // const [fetchingUsd, setFetchingUsd] = React.useState(false);
  // const [fetchingFearGreed, setFetchingFearGreed] = React.useState(false);

  const skipStrictModeRerender = useRef(false);

  const fetchVixData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/fetchVix`);
      const data = await res.json();
      updateDashboard({
        stocksData: {
          ...stocksData,
          vix: parseFloat(data?.chart?.result[0]?.meta?.regularMarketPrice),
        },
      });
    } catch (err) {
      console.error('Error fetching VIX:', err);
    }
    // setFetchingVix(false);
  };

  const fetchRsiData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/fetchRsiSP500`);
      const data = await res.json();
      const lastUpdate = data['Meta Data']['3: Last Refreshed'];
      const lastRsi = data['Technical Analysis: RSI'][lastUpdate]['RSI'];
      updateDashboard({
        stocksData: {
          ...stocksData,
          rsiSP500: parseFloat(lastRsi),
        },
      });
    } catch (err) {
      console.error('Error fetching RSI S&P 500:', err);
    }
    // setFetchingRsi(false);
  };

  const fetchUsdData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/fetchEurUsd`);
      const data = await res.json();
      updateDashboard({
        stocksData: {
          ...stocksData,
          eurUsd: parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']),
        },
      });
    } catch (err) {
      console.error('Error fetching USD:', err);
    }
    // setFetchingUsd(false);
  };

  const fetchFearGreedData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/fetchFearGreed`);
      const data = await res.json();
      updateDashboard({
        stocksData: {
          ...stocksData,
          fearGreed: parseFloat(data.fear_and_greed.score),
        },
      });
    } catch (err) {
      console.error('Error fetching USD:', err);
    }
    // setFetchingFearGreed(false);
  };

  useEffect(() => {
    // Avoid dev double call in Strict Mode to not double fetch real data (limited free plan 25 calls per day)
    if (skipStrictModeRerender.current) return;
    skipStrictModeRerender.current = true;

    if (!vix) {
      // setFetchingVix(true);
      fetchVixData();
    }
    if (!rsiSP500) {
      // setFetchingRsi(true);
      fetchRsiData();
    }
    if (!eurUsd) {
      // setFetchingUsd(true);
      fetchUsdData();
    }
    if (!fearGreed) {
      // setFetchingFearGreed(true);
      fetchFearGreedData();
    }
  }, []);

  // const fetchMarketData = async () => {
  //   updateDashboard({
  //     isLoading: true,
  //     stocksData: null,
  //     cryptoData: null,
  //   });
  //   // updateDashboard({ isLoading: true });

  //   // let mockStockData:TStocksData, mockCryptoData:TCryptoData;
  //   // setTimeout(() => {
  //   //   mockStockData = {
  //   //     vix: MarketIndexValues.Vix + (Math.random() - 0.5) * 2,
  //   //     rsiSP500: MarketIndexValues.RsiSP500 + (Math.random() - 0.5) * 5,
  //   //     eurUsd: MarketIndexValues.EurUsd + (Math.random() - 0.5) * 0.02,
  //   //     fearGreed: Math.max(0, Math.min(100, MarketIndexValues.FearGreed + (Math.random() - 0.5) * 10)),
  //   //     lastUpdated: new Date().toISOString(),
  //   //   };

  //   //   mockCryptoData = {
  //   //     btcFearGreed: Math.max(0, Math.min(100, MarketIndexValues.BtcFearGreed + (Math.random() - 0.5) * 15)),
  //   //     btcRsi: Math.max(0, Math.min(100, MarketIndexValues.BtcRsi + (Math.random() - 0.5) * 10)),
  //   //     btcDominance: MarketIndexValues.BtcDominance + (Math.random() - 0.5) * 2,
  //   //     altSeasonIndex: Math.max(0, Math.min(100, MarketIndexValues.AltSeasonIndex + (Math.random() - 0.5) * 15)),
  //   //     lastUpdated: new Date().toISOString(),
  //   //   };
  //   //   updateDashboard({
  //   //     isLoading: false,
  //   //     stocksData: mockStockData,
  //   //     cryptoData: mockCryptoData,
  //   //   });
  //   // }, 2000);
  // };

  // useEffect(() => {
  //   // if (!isLoading) {
  //   //   updateDashboard({
  //   //     refetchMarketData: fetchMarketData,
  //   //   });
  //   // }
  // }, []);
  return (
    <DashboardLayout />
  );
};

export default DashboardContainer;
