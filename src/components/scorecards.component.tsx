import Box from '@mui/material/Box';
import React, {
  useContext,
} from 'react';

import DashboardContext from '../context/dashboard.context';
import type {
  IDashboardContext,
} from '../interfaces/dashboard';
import ScoreCardBoxLayout from '../layouts/scorecard-box.layout';
import { getCryptoInterpretation, getStockInterpretation } from '../utils/formula';

type TScoreCardsComponentProps = {
  stocksScore?: number;
  cryptoScore?: number;
}

const ScoreCardsComponent: React.FC<TScoreCardsComponentProps> = ({
  stocksScore = 0,
  cryptoScore = 0,
}) => {
  const {
    stocksData,
    cryptoData,
    activeTab,
  } = useContext<IDashboardContext>(DashboardContext);

  if (!stocksData || !cryptoData) return;
  const stocksScoreValues = {
    score: stocksScore,
    interpretation: getStockInterpretation(stocksScore),
    lastUpdated: stocksData.lastUpdated,
  };

  const cryptoScoreValues = {
    score: cryptoScore,
    interpretation: getCryptoInterpretation(cryptoScore),
    lastUpdated: cryptoData.lastUpdated,
  };

  const scoreToShow = activeTab === 0 ? stocksScoreValues : cryptoScoreValues;

  return (
    <>
      <Box>
        <Box mb={4}>
          <ScoreCardBoxLayout
            score={scoreToShow.score}
            interpretation={scoreToShow.interpretation}
            lastUpdated={scoreToShow.lastUpdated}
          />
        </Box>

      </Box>

    </>
  );
};

export default ScoreCardsComponent;
