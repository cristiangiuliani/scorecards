
import {
  ShowChart,
  CurrencyBitcoin,
  BubbleChart,
  AccountBalance,
  TrendingUp,
  Menu as MenuIcon,
  GitHub,
  Home,
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
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleSelectMenuItem = (index: number) => {
    updateDashboard({
      activeTab: index,
    });
    handleCloseMenu();
  };

  const menuList = [
    {
      icon: <ShowChart />,
      label: 'Stocks',
    },
    {
      icon: <CurrencyBitcoin />,
      label: 'Crypto',
    },
    {
      icon: <AccountBalance />,
      label: 'Bonds',
    },
    {
      icon: <BubbleChart />,
      label: 'AI Bubble',
    },
    {
      icon: <TrendingUp />,
      label: 'Capital Flows',
    },
  ];

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
        <Box
          sx={{
            flexGrow: 1,
            mb: {
              xs: 3,
              sm: 8,
            },
          }}

        >
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

                >
                  <Box>
                    <img
                      src="assets/logo.png"
                      alt="Scorecards Logo"
                      style={{ height: 40 }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1}
                    textAlign="center"
                    sx={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Simplified market analysis
                  </Typography>

                </Grid>

                <Grid
                  size="grow"
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Tabs
                    value={activeTab}
                    onChange={(_e, newValue) => handleSelectMenuItem(newValue)}
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'none',
                        md: 'flex',
                      },
                    }}
                  >
                    { menuList.map((menuItem, index) => (
                      <Tab
                        key={index}
                        icon={menuItem.icon}
                        label={menuItem.label}
                        iconPosition="start"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 'medium',
                          padding: '0px 8px',

                        }}
                      />
                    )) }

                  </Tabs>
                </Grid>
                <Grid size="auto">
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleClick}
                    sx={{
                      display: {
                        md: 'none',
                        sm: 'block',
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    slotProps={{
                      list: {
                        'aria-labelledby': 'basic-button',
                      },
                    }}
                  >
                    { menuList.map((menuItem, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleSelectMenuItem(index)}
                        selected={index === activeTab}
                      >
                        <ListItemIcon>
                          {menuItem.icon}
                        </ListItemIcon>
                        <ListItemText>{menuItem.label}</ListItemText>
                      </MenuItem>
                    )) }

                  </Menu>
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
      <Divider />

      <Grid container mb={2}>
        <Grid
          size={{
            xs: 12,
            sm: 'grow',
          }}
          sx={{
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Cristian Giuliani. All rights reserved.
          </Typography>

        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 'auto',
          }}
          sx={{
            textAlign: {
              xs: 'center',
              sm: 'right',
            },

          }}
        >
          <Typography variant="caption" color="text.secondary">
            <Button
              disableRipple
              sx={{
                fontSize: 'inherit',
                textTransform: 'none',
              }}
              startIcon={<GitHub fontSize="inherit" />}
              onClick={() => window.open('https://github.com/cristiangiuliani/scorecards', '_blank')}
            >
              GitHub Repository
            </Button>&nbsp;|&nbsp;
            <Button
              disableRipple
              sx={{
                fontSize: 'inherit',
                textTransform: 'none',
              }}
              startIcon={<Home fontSize="inherit" />}
              onClick={() => window.open('https://www.cristiangiuliani.com', '_blank')}
            >
              Author Website
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <DisclaimerComponent />
    </ThemeProvider>
  );
};

export default DashboardLayout;
