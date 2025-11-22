import {
  Alert, Divider, List, ListItem, ListItemText, Skeleton, Typography,
  useTheme,
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
  const theme = useTheme();

  const getBackgroundColor = (item: TStrategiesListItem) => {
    const color = item?.color ? item.color : 'info';
    return theme.palette[color].darkGradient;
  };
  return (
    <>

      <Grid container>
        {strategiesList.map((item, index) => (
          <Grid
            key={`strategy-list-${index}`}
            p={2}
            size={{
              xs: 12,
              sm: 6,
              md: strategiesList.length > 3 ? 3 : 4,
            }}
            sx={{
              background: getBackgroundColor(item),
              opacity: 0.6,
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
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    opacity: 0.9,
                  }}
                >
                  {item.title}
                </Typography>
                <List dense>
                  {item.items.map((subItem, subIndex) => (
                    <React.Fragment key={subItem.label || `strategy-item-${index}-${subIndex}`}>
                      <Divider component="li" />
                      <ListItem
                        disableGutters
                        sx={{
                          py: 0.5,
                          opacity: 0.8,
                        }}
                      >
                        <ListItemText
                          primary={subItem.label ? `${subItem.label} ${subItem.value}` : subItem.value}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </>
            ) : (
              <Alert severity="warning">Component cannot retrieve strategies data. Try later.</Alert>
            )}
          </Grid>
        ))}
      </Grid>

    </>
  );
};

export default StrategiesComponent;
