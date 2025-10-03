import {
  Box, Divider, Paper, Typography,
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

      <Grid container spacing={3}>
        {strategiesList.map((item, index) => (
          <Grid
            key={`strategy-list-${index}`}
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 3,
                height: '100%',
                borderTop: '4px solid',
                borderTopColor: `${item.color}.main`,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
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
            </Paper>
          </Grid>
        ))}
      </Grid>

    </>
  );
};

export default StrategiesComponent;
