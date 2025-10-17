
import {
  Refresh,
  ShowChart,
  CurrencyBitcoin,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Paper,
  CircularProgress,
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
import MarketCrypto from '../market-crypto/market-crypto';
import MarketStocks from '../market-stocks/market-stocks';
import { ErrorDisplay } from '../shared/components/error-display';

import DashboardContext from './dashboard.context';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  // palette: {
  //   primary: {
  //     main: '#1976d2',
  //   },
  //   secondary: {
  //     main: '#ff9800',
  //   },
  //   success: {
  //     main: '#4caf50',
  //   },
  //   error: {
  //     main: '#f44336',
  //   },
  //   warning: {
  //     main: '#ff9800',
  //   },
  // },
});
const DashboardLayout: React.FC = () => {
  const {
    isLoading,
    isDemo,
    activeTab = GLOBALS.defaultActiveTab,
    refetchMarketData = () => {},
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
                label="Traditional Markets"
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
            </Tabs>

            <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
              onClick={refetchMarketData}
              disabled={isLoading}
              sx={{
                textTransform: 'none',
              }}
            >
              Update
            </Button>
          </Box>
        </Paper>

        {activeTab === 0 && <MarketStocks />}
        {activeTab === 1 && <MarketCrypto />}
      </Container>
    </ThemeProvider>
  );
};

export default DashboardLayout;
