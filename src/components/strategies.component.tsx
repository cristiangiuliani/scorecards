import Grid from '@mui/material/Grid';
import React, {
  useContext,
} from 'react';

import DashboardContext from '../context/dashboard.context';
import type {
  IDashboardContext,
} from '../interfaces/dashboard';
import StrategyCardLayout from '../layouts/strategy-card.layout';

type TStrategiesComponentProps = {
  stocksScore?: number;
  cryptoScore?: number;
};

const StrategiesComponent: React.FC<TStrategiesComponentProps> = ({
  stocksScore = 0,
  cryptoScore = 0,

}) => {
  const {
    cryptoData,
    activeTab,
  } = useContext<IDashboardContext>(DashboardContext);

  if (!cryptoData) return;

  const { btcDominance = 0 } = cryptoData;

  const StocksStrategyList = [
    {
      title: '💼 Portfolio Strategy',
      color: 'primary',
      items: [
        {
          label: 'Current Allocation',
          value: stocksScore > 3 ? 'Increase equity exposure' :
            stocksScore < -3 ? 'Increase bonds and defensives' :
              'Maintain balanced allocation',
        },
      ],
    },
    {
      title: '🎯 Sector Focus',
      color: 'success',
      items: [
        {
          label: 'Recommended Sectors',
          value: stocksScore > 3 ? 'Tech, Growth, Small Cap' :
            stocksScore < -3 ? 'Defense, Staples, REITs' :
              'Current diversification OK',
        },
      ],
    },
    {
      title: '⚠️ Risk Management',
      color: 'warning',
      items: [
        {
          label: 'Risk Level',
          value: Math.abs(stocksScore) > 6 ? 'Caution: extreme signal' :
            Math.abs(stocksScore) > 3 ? 'Active monitoring' :
              'Controlled risk',
        },
      ],
    },
  ];

  const CryptoStrategyList = [
    {
      title: '₿ Crypto Strategy',
      color: 'secondary',
      items: [
        {
          label: 'Market Phase',
          value: cryptoScore > 2 ? 'Active bull market' :
            cryptoScore < -2 ? 'Bear market / Winter' :
              'Crab market / Accumulation',
        },
      ],
    },
    {
      title: '⚖️ BTC vs Altcoins',
      color: 'info',
      items: [
        {
          label: 'Current Balance',
          value: btcDominance > 60 ? 'Focus Bitcoin (quality)' :
            btcDominance < 45 ? 'Active altseason' :
              'BTC/Alt balance',
        },
      ],
    },
    {
      title: '🚨 Risk Level',
      color: 'error',
      items: [
        {
          label: 'Current Risk',
          value: Math.abs(cryptoScore) > 4 ? 'Extreme - Prepare exit/entry' :
            Math.abs(cryptoScore) > 2 ? 'Moderate - Active trend' :
              'Low - Patience/DCA',
        },
      ],
    },
  ];

  const strategyListToShow = activeTab === 0 ? StocksStrategyList : CryptoStrategyList;
  return (
    <>

      <Grid container spacing={3}>
        {strategyListToShow.map((item) => (
          <Grid
            key={item.title}
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <StrategyCardLayout
              title={item.title}
              color={item.color}
              items={item.items}
            />
          </Grid>
        ))}
      </Grid>

    </>
  );
};

export default StrategiesComponent;
