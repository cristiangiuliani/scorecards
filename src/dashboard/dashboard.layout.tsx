
import {
  ShowChart,
  CurrencyBitcoin,
  BubbleChart,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Container,
  Alert,
  CssBaseline,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material';
import {
  createTheme, ThemeProvider,
} from '@mui/material/styles';
import React, { useContext } from 'react';

import { GLOBALS } from '../constants/config';
import type {
  IDashboardContext,
} from '../interfaces/dashboard';
import MarketBubble from '../market-bubble/market-bubble';
import MarketCrypto from '../market-crypto/market-crypto';
import MarketStocks from '../market-stocks/market-stocks';
import { ErrorDisplay } from '../shared/components/error-display';

import DashboardContext from './dashboard.context';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const DashboardLayout: React.FC = () => {
  const {
    isDemo,
    activeTab = GLOBALS.defaultActiveTab,
    updateDashboard,
  } = useContext<IDashboardContext>(DashboardContext);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorDisplay />
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          minHeight: '100vh',
        }}
      >
        <Box sx={{ flexGrow: 1 }} mb={8}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  flexGrow: 1,
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid size="auto"alignItems="center">
                    <Typography variant="h4" color="text.secondary" lineHeight={1} fontWeight="bold">
                      Market Scorecard
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1}>
                      Automated market reversal analysis system
                    </Typography>

                  </Grid>

                  <Grid size="grow" container alignItems="center" justifyContent="flex-end">
                    <Tabs
                      value={activeTab}
                      onChange={(_e, newValue) => updateDashboard({
                        activeTab: newValue,
                      })}
                    >
                      <Tab
                        icon={<ShowChart />}
                        label="Stocks Market"
                        iconPosition="start"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 'medium',
                        }}
                      />
                      <Tab
                        icon={<CurrencyBitcoin />}
                        label="Crypto"
                        iconPosition="start"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 'medium',
                        }}
                      />
                      <Tab
                        icon={<BubbleChart />}
                        label="AI Bubble"
                        iconPosition="start"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 'medium',
                        }}
                      />
                    </Tabs>
                  </Grid>
                </Grid>

              </Typography>
            </Toolbar>
          </AppBar>
        </Box>

        { isDemo && <Alert severity="warning">DEMO MODE: Scorecards is using demo MOCK data.</Alert>}

        { activeTab === 1 ? (
          <MarketCrypto />
        ) : activeTab === 2 ? (
          <MarketBubble />
        ) : (
          <MarketStocks />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default DashboardLayout;
