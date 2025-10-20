import {
  Alert,
  Box, Card, CardContent, Chip, Icon, Skeleton, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, {

} from 'react';

import type { TIndicatorsListItem } from '../../types/data.type';

type TIndicatorsComponentProps = {
  indexList: TIndicatorsListItem[];
};

const IndicatorsComponent: React.FC<TIndicatorsComponentProps> = ({
  indexList = [],
}) => {
  return (
    <>
      <Grid container spacing={3} mb={4}>
        {
          indexList.map((item, index) => (
            <Grid
              key={`indicator-${index}`}
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <Card
                elevation={2}
                sx={{
                  height: '100%',
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
                        <Box display="flex" alignItems="center" gap={1}>
                          <Icon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            {item.label}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={item.score > 0 ? `+${item.score}` : item.score}
                          color={item.score > 0 ? 'success' : item.score < 0 ? 'error' : 'default'}
                          variant="outlined"
                        />
                      </Box>

                      <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
                        {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Weight: {item.weight}x
                      </Typography>
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

    </>
  );
};

export default IndicatorsComponent;
