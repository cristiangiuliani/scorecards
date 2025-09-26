import {
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import React from 'react';

import type { TInterpretation } from '../types/data.type';

type TScoreCardBoxLayoutProps = {
  score: number;
  interpretation: TInterpretation;
  lastUpdated: string;
};

const ScoreCardBoxLayout: React.FC<TScoreCardBoxLayoutProps> = ({
  score, interpretation, lastUpdated,
}) => (
  <Paper
    elevation={4}
    sx={{
      p: 4,
      textAlign: 'center',
      background: interpretation.severity === 'success' ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' :
        interpretation.severity === 'error' ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' :
          interpretation.severity === 'warning' ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' :
            'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
    }}
  >
    <Typography variant="h2" component="div" fontWeight="bold" color="text.primary" mb={2}>
      {score.toFixed(1)}
    </Typography>

    <Chip
      label={interpretation.text}
      color={interpretation.color}
      size='medium'
      sx={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        mb: 2,
      }}
    />

    <Typography variant="body2" color="text.secondary">
      Last updated: {new Date(lastUpdated).toLocaleTimeString('en-US')}
    </Typography>
  </Paper>
);
export default ScoreCardBoxLayout;
