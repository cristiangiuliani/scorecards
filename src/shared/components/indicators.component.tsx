import {
  WarningOutlined, ErrorOutline, InfoOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box, Card, CardActions, CardContent, CardHeader, Skeleton, Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, {

} from 'react';

import type { TIndicatorsListItem } from '../../types/data.type';

import { ScoreGauge } from './score-gauge.component';
import { StyledBlackTooltip } from './styled-dark-tooltip.component';

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
              md: 4,
            }}
          >
            <Card
              elevation={2}
              sx={{
                height: '100%',
                backgroundColor: getBackgroundColor(item?.score),
              }}
            >
              <CardHeader
                subheader={item.label}
                sx={{
                  textAlign: 'center',
                  paddingBottom: 0,
                }}
              />
              <CardContent sx={{
                paddingTop: 0,
                paddingBottom: 0,
              }}
              >
                {item.isLoading ?  (
                  <>
                    <Skeleton height={25} />
                    <Skeleton height={50} width={50} />
                    <Skeleton height={20} width={50} />
                  </>
                ) : item?.value !== undefined && item?.score !== undefined ? (
                  <>

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

                      </Box>
                    ) : (
                      <>
                        <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
                          {typeof item.value === 'number' && !isNaN(item.value) ?
                            item.value.toFixed(2)
                            : (
                              <ErrorOutline color="error" fontSize="large" />
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
              <CardActions sx={{
                justifyContent: 'center',
              }}
              >
                <StyledBlackTooltip
                  title={<Typography variant='caption'>{item.description && <>{item.description}</>}</Typography>}
                  placement="left"
                  arrow
                  enterTouchDelay={0}
                >
                  <InfoOutlined
                    color="action"
                    sx={{
                      fontSize: 14,
                      opacity: 0.4,
                      cursor: 'help',
                      ':hover': { opacity: 0.6 },
                    }}
                  />
                </StyledBlackTooltip>
                {item.alert && (
                  <StyledBlackTooltip
                    title={<Typography variant='caption'>{<>{item.alert}</>}</Typography>}
                    placement="left"
                    arrow
                    enterTouchDelay={0}
                  >
                    <WarningOutlined
                      color="action"
                      sx={{
                        fontSize: 14,
                        opacity: 0.4,
                        cursor: 'help',
                        ':hover': { opacity: 0.6 },
                      }}
                    />
                  </StyledBlackTooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))
      }
    </Grid>

  );
};

export default IndicatorsComponent;
