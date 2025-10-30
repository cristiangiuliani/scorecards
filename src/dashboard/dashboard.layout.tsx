
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
  Paper,
  Container,
  Alert,
  CssBaseline,
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
import { VersionComponent } from '../shared/components/version.component';

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
        maxWidth="xl"
        sx={{
          py: 4,
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Market Scorecard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Automated market reversal analysis system
          </Typography>
          <VersionComponent />

        </Box>
        { isDemo && <Alert severity="warning">DEMO MODE: Scorecards is using demo MOCK data.</Alert>}

        {/* Navigation */}
        <Paper
          elevation={1}
          sx={{
            mb: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
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

            {/* <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
              onClick={refetchMarketData}
              disabled={isLoading}
              sx={{
                textTransform: 'none',
              }}
            >
              Update
            </Button> */}
          </Box>
        </Paper>
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
