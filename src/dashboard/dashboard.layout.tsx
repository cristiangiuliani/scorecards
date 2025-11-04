
import {
  ShowChart,
  CurrencyBitcoin,
  BubbleChart,
  AccountBalance,
  TrendingUp,
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
import MarketCapitalFlows from '../market-capital-flows/market-capital-flows';
import MarketCrypto from '../market-crypto/market-crypto';
import MarketStocks from '../market-stocks/market-stocks';
import MarketTreasuryBonds from '../market-treasury-bonds/market-treasury-bonds';
import { DisclaimerComponent } from '../shared/components/disclaimer.component';
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

              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-start"
                size="grow"
              >
                <Grid
                  size="auto"
                  alignItems="center"
                  sx={{
                    display: {
                      xs: 'none',
                      sm: 'block',
                    },
                  }}
                >
                  <Typography variant="h4" color="text.secondary" lineHeight={1} fontWeight="bold">
                    Market Scorecard
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1}>
                    Automated market reversal analysis system
                  </Typography>

                </Grid>

                <Grid
                  size="grow"
                  container
                  alignItems="center"
                  justifyContent={{
                    xs: 'center',
                    sm: 'flex-end',
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={(_e, newValue) => updateDashboard({
                      activeTab: newValue,
                    })}
                  >
                    <Tab
                      icon={<ShowChart />}
                      label="Stocks"
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
                      icon={<AccountBalance />}
                      label="Bonds"
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
                    <Tab
                      icon={<TrendingUp />}
                      label="Capital Flows"
                      iconPosition="start"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'medium',
                      }}
                    />

                  </Tabs>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Box>

        { isDemo && <Alert severity="warning">DEMO MODE: Scorecards is using demo MOCK data.</Alert>}

        { activeTab === 1 ? (
          <MarketCrypto />
        ) : activeTab === 2 ? (
          <MarketTreasuryBonds />
        ) : activeTab === 3 ? (
          <MarketBubble />
        ) : activeTab === 4 ? (
          <MarketCapitalFlows />
        ) : (
          <MarketStocks />
        )}
      </Container>
      <DisclaimerComponent />
    </ThemeProvider>
  );
};

export default DashboardLayout;
