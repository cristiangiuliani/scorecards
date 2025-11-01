import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Alert,
  Box, Card, CardContent, Chip, Skeleton, Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, {

} from 'react';

import type { TIndicatorsListItem } from '../../types/data.type';

import { ScoreGauge } from './score-gauge.component';

type TIndicatorsComponentProps = {
  indexList: TIndicatorsListItem[];
};

const IndicatorsComponent: React.FC<TIndicatorsComponentProps> = ({
  indexList = [],
}) => {
  const theme = useTheme();

  const getBackgroundColor = (score?:number) => {
    if (score === undefined) return undefined;
    if (score > 0) return theme.palette.success.dark;
    if (score < 0) return theme.palette.error.dark;
    return theme.palette.grey[700];
  };

  return (
    <Grid
      container
      spacing={2}
    >
      {
        indexList.map((item, index) => (
          <Grid
            key={`indicator-${index}`}
            size={{
              xs: 12,
              sm: 6,
              md: indexList.length > 4 ? 4 : 6,
            }}
          >
            <Card
              elevation={2}
              sx={{
                height: '100%',
                backgroundColor: getBackgroundColor(item?.score),
              }}
            >
              <CardContent>
                {item.isLoading ?  (
                  <>
                    <Skeleton height={25} />
                    <Skeleton height={50} width={50} />
                    <Skeleton height={20} width={50} />
                  </>
                ) : item?.value !== undefined && item?.score !== undefined ? (
                  <>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Box display="flex" gap={1}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          {item.label}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={item.score > 0 ? `+${item.score}` : item.score}
                        variant="outlined"
                        sx={{
                          color: '#fff',
                          borderColor: '#fff',
                          opacity: 0.5,
                        }}
                      />
                    </Box>

                    {item.min !== undefined && item.max !== undefined ? (
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <ScoreGauge
                          value={item.value}
                          decimals={item.decimals}
                          width={160}
                          height={130}
                          min={item.min}
                          max={item.max}
                          fontSize={22}
                          minLabel={item.minLabel}
                          maxLabel={item.maxLabel}
                          labelFontSize={10}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Weight: {item.weight}x
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
                          {typeof item.value === 'number' && !isNaN(item.value) ?
                            item.value.toFixed(2)
                            : (
                              <ErrorOutlineIcon color="error" fontSize="large" />
                            )}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Weight: {item.weight}x
                        </Typography>
                      </>
                    )}
                  </>
                ) : (
                  <Alert severity="warning">Component cannot retrieve indicators data. Try later.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))
      }
    </Grid>

  );
};

export default IndicatorsComponent;
