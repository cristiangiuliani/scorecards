import Box from '@mui/material/Box';
import React, {
  useContext,
} from 'react';

import DashboardContext from '../context/dashboard.context';
import type {
  IDashboardContext,
} from '../interfaces/dashboard';
import {
  calculateCryptoScore, calculateStocksScore,
} from '../utils/formula';

import IndicatorsComponent from './indicators.component';
import ScoreCardsComponent from './scorecards.component';
import StrategiesComponent from './strategies.component';

const DashboardComponent: React.FC = () => {
  const {
    stocksData,
    cryptoData,
  } = useContext<IDashboardContext>(DashboardContext);

  if (!stocksData || !cryptoData) return;
  const stocksScore = calculateStocksScore(stocksData);
  const cryptoScore = calculateCryptoScore(cryptoData);

  return (
    <>
      <Box>
        <ScoreCardsComponent
          stocksScore={stocksScore}
          cryptoScore={cryptoScore}
        />

        <IndicatorsComponent />

        <StrategiesComponent
          stocksScore={stocksScore}
          cryptoScore={cryptoScore}
        />
      </Box>
    </>
  );
};

export default DashboardComponent;
