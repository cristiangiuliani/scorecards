import { Update } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton, Typography,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import type { TInterpretation } from '../../types/data.type';

import { ScoreGauge } from './score-gauge.component';

const EXPIRES_INTERVAL = 60000; // 1 minute

type TScoreCardsComponentProps = {
  score: number;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  decimals?: number;
  interpretation: TInterpretation;
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
  isLoading?: boolean;
  refetchAllData?: () => void;
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
  min = -10,
  max = 10,
  minLabel,
  maxLabel,
  interpretation = undefined,
  cacheCreatedAt = null,
  cacheExpiresAt = null,
  isLoading = false,
  refetchAllData = () => {},
}) => {
  const theme = useTheme();
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const userLocale = navigator.language || 'nl-NL';

  const getBackgroundColor = () => {
    if (!interpretation?.color) return undefined;
    if (interpretation.color === 'default') return theme.palette.grey[700];
    return theme.palette[interpretation.color].dark;
  };

  const updateMinutesRemaining = () => {
    if (cacheExpiresAt) {
      const remaining = Math.round((new Date(cacheExpiresAt).getTime() - new Date().getTime()) / EXPIRES_INTERVAL);
      setMinutesRemaining(remaining);
    } else {
      setMinutesRemaining(null);
    }
  };

  const refreshData = () => {
    updateMinutesRemaining();
    refetchAllData();
  };

  useEffect(() => {
    updateMinutesRemaining();
    const interval = setInterval(updateMinutesRemaining, EXPIRES_INTERVAL);
    return () => clearInterval(interval);
  }, [cacheExpiresAt, cacheCreatedAt]);

  useEffect(() => {
    if (cacheCreatedAt) {
      const formattedTime = new Date(cacheCreatedAt).toLocaleTimeString(userLocale, {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastUpdated(formattedTime);
    } else {
      setLastUpdated(null);
    }
  }, [cacheCreatedAt, userLocale]);

  return (
    <>

      <Card
        sx={{
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: getBackgroundColor(),
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
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
              <ScoreGauge value={score} width={250} height={200} min={min} max={max} fontSize={54} minLabel={minLabel} maxLabel={maxLabel} />

              <Chip
                label={interpretation.text}
                size='medium'
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  mb: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  color: getBackgroundColor(),
                  maxWidth: '200px',
                  margin: '0.5rem auto',
                }}
              />
              {minutesRemaining !== null && (
                <Typography variant="body2" color="text.secondary">
                  Last updated: {lastUpdated}<br />{ minutesRemaining <= 0
                    ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={refreshData}
                        startIcon={<Update />}
                        sx={{
                          backgroundColor: '#fff',
                          textTransform: 'none',

                          opacity: 0.5,
                          borderRadius: '4px',
                          padding: '0px 8px',
                          ':hover, :active, :focus, :link, :visited': {
                            backgroundColor: '#fff',
                            opacity: 0.6,
                          },
                        }}
                      >
                        Refresh now
                      </Button>
                    ) : `Updates in ${formatTimeRemaining(minutesRemaining)}` }
                </Typography>
              )}
            </>
          ) : (
            <Alert severity="warning">Component cannot retrieve scorecards data. Try later.</Alert>
          )
          }
        </CardContent>
      </Card>

    </>
  );
};

export default ScoreCardsComponent;
