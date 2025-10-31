import {
  Alert,
  Box, Divider, Paper, Skeleton, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

import type { TStrategiesListItem } from '../../types/data.type';

type TStrategiesComponentProps = {
  strategiesList?: TStrategiesListItem[];
};

const StrategiesComponent: React.FC<TStrategiesComponentProps> = ({
  strategiesList = [],
}) => {
  return (
    <>

      <Grid container spacing={2}>
        {strategiesList.map((item, index) => (
          <Grid
            key={`strategy-list-${index}`}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderTop: '4px solid',
                borderTopColor: `${item.color}.main`,
              }}
            >
              { item.isLoading ? (
                <>
                  <Skeleton height={50}  />
                  <Skeleton height={65}  />
                  <Skeleton height={65}  />
                  <Skeleton height={65}  />
                </>
              )  :  item?.items?.length > 0 ? (
                <>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Divider sx={{
                    mb: 2,
                  }}
                  />
                  {item.items.map((item) => (
                    <Box key={item.label} mb={2}>
                      <Typography variant="subtitle2" color="text.primary" fontWeight="medium" gutterBottom>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </>
              ) : (
                <Alert severity="warning">Component cannot retrieve strategies data. Try later.</Alert>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

    </>
  );
};

export default StrategiesComponent;
