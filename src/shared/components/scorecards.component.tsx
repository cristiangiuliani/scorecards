import {
  Alert,
  Chip, Paper, Skeleton, Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';

import type { TInterpretation } from '../../types/data.type';

const EXPIRES_INTERVAL = 60000; // 1 minute

type TScoreCardsComponentProps = {
  score: number;
  interpretation: TInterpretation;
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
  isLoading?: boolean;
};

const formatTimeRemaining = (minutes: number): string => {
  if (minutes < 1) return 'less than 1 min';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${mins} min${mins > 1 ? 's' : ''}`;
  }
};

const ScoreCardsComponent: React.FC<TScoreCardsComponentProps> = ({
  score = undefined,
  interpretation = undefined,
  cacheCreatedAt = null,
  cacheExpiresAt = null,
  isLoading = false,
}) => {
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);

  useEffect(() => {
    const updateMinutesRemaining = () => {
      if (cacheExpiresAt) {
        const remaining = Math.round((new Date(cacheExpiresAt).getTime() - new Date().getTime()) / EXPIRES_INTERVAL);
        setMinutesRemaining(remaining);
      } else {
        setMinutesRemaining(null);
      }
    };

    updateMinutesRemaining();
    const interval = setInterval(updateMinutesRemaining, EXPIRES_INTERVAL);

    return () => clearInterval(interval);
  }, [cacheExpiresAt]);

  return (
    <>
      <Box>
        <Box mb={4}>

          <Paper
            elevation={4}
            sx={{
              p: 4,
              textAlign: 'center',
              // background: interpretation.severity === 'success' ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' :
              //   interpretation.severity === 'error' ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' :
              //     interpretation.severity === 'warning' ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' :
              //       'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            }}
          >
            { isLoading ? (
              <>
                <Skeleton height={80} width={60} sx={{ margin: '0 auto' }} />
                <Skeleton height={50} width={100} sx={{ margin: '0 auto' }} />
                <Skeleton height={20} width={150} sx={{ margin: '0 auto' }} />
              </>
            ) : score !== undefined && interpretation !== undefined ? (
              <>
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
                  Last updated: {cacheCreatedAt && new Date(cacheCreatedAt).toLocaleTimeString('nl-NL')} - expires in {minutesRemaining !== null ? ` ${formatTimeRemaining(minutesRemaining)}` : ' N/A'}
                </Typography>
              </>
            ) : (
              <Alert severity="warning">Component cannot retrieve scorecards data. Try later.</Alert>
            )
            }
          </Paper>

        </Box>

      </Box>

    </>
  );
};

export default ScoreCardsComponent;
