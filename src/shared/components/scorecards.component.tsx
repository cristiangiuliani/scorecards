import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UpdateIcon from '@mui/icons-material/Update';
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { COMMON_LABELS } from '../../constants/labels';
import type { TInterpretation } from '../../types/data.type';

import { ScoreGauge } from './score-gauge.component';
import { StyledBlinkingBadge } from './styled-blinking-badge.component';
import { StyledBlackTooltip } from './styled-dark-tooltip.component';

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
  label?: string;
  description?: string;
  thresholds?: string[];
  refetchAllData?: () => void;
};

const formatTimeRemaining = (minutes: number): string => {
  if (minutes < 1) return 'less than 1 min';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
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
  label = '',
  description = '',
  thresholds = [
    `Score > 7: ${COMMON_LABELS.StrongBullish}`,
    `Score > 3: ${COMMON_LABELS.Bullish}`,
    `Score > -3: ${COMMON_LABELS.CrabMarket}`,
    `Score > -7: ${COMMON_LABELS.Bearish}`,
    `Score ≤ -7: ${COMMON_LABELS.StrongBearish}`,
  ],
  refetchAllData = () => {},
}) => {
  const theme = useTheme();
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const userLocale = navigator.language || 'nl-NL';

  const getBackgroundColor = () => {
    const color = interpretation?.color ? interpretation.color : 'info';
    return theme.palette[color].gradient;
  };

  const getTextColor = () => {
    const color = interpretation?.color ? interpretation.color : 'info';
    return theme.palette[color].dark;
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
      const date = new Date(cacheCreatedAt);
      const formattedDate = date.toLocaleDateString(userLocale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString(userLocale, {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastUpdated(`${formattedDate} at ${formattedTime}`);
    } else {
      setLastUpdated(null);
    }
  }, [cacheCreatedAt, userLocale]);

  useEffect(() => {
    if (minutesRemaining !== null && minutesRemaining <= 0) {
      refreshData();
    }
  }, [minutesRemaining]);

  return (
    <>

      <Card
        sx={{
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: getBackgroundColor(),
          borderRadius: 0,
        }}
      >
        <CardHeader title={label} sx={{ opacity: 0.7 }} />
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
                  color: getTextColor(),
                  maxWidth: '200px',
                  margin: '0.5rem auto',
                }}
              />

            </>
          ) : (
            <Alert severity="warning">Component cannot retrieve scorecards data. Try later.</Alert>
          )
          }
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <StyledBlackTooltip
            title={(
              <Typography variant="caption">
                {description && (
                  <>
                    {description}
                    <br />
                    <br />
                  </>
                )}
                <strong>Legend:</strong>
                <br />
                {thresholds.map((threshold, index) => (
                  <React.Fragment key={index}>
                    {threshold}
                    {index < thresholds.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Typography>
            )}
            placement="top"
            arrow
            enterTouchDelay={0}
          >
            <InfoOutlinedIcon
              color="action"
              sx={{
                fontSize: 18,
                opacity: 0.5,
                cursor: 'help',
                ':hover': { opacity: 0.7 },
              }}
            />
          </StyledBlackTooltip>
          <StyledBlackTooltip
            title={(
              <>
                {minutesRemaining !== null && (
                  <Typography
                    variant="caption"

                  >
                    Last updated {lastUpdated}.<br />
                    Updates in {formatTimeRemaining(minutesRemaining)}
                  </Typography>
                )}
              </>
            )}
            placement="top"
            arrow
            enterTouchDelay={0}
          >
            <StyledBlinkingBadge color="info" variant="dot" invisible={minutesRemaining === null || minutesRemaining > 0}>
              <UpdateIcon
                color="action"
                sx={{
                  fontSize: 18,
                  opacity: 0.5,
                  cursor: 'help',
                  ':hover': { opacity: 0.7 },
                }}
              />
            </StyledBlinkingBadge>
          </StyledBlackTooltip>

        </CardActions>
      </Card>

    </>
  );
};

export default ScoreCardsComponent;
