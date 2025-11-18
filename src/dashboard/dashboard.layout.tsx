
import {
  ShowChart,
  CurrencyBitcoin,
  BubbleChart,
  AccountBalance,
  TrendingUp,
  Menu as MenuIcon,
  GitHub,
  Home,
  Gavel,
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
import {
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom';

import type {
  IDashboardContext,
} from '../interfaces/dashboard';
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
    navigate(menuList[index].path);
    handleCloseMenu();
  };

  const navigate = useNavigate();
  const location = useLocation();

  const menuList = [
    {
      icon: <ShowChart />,
      label: 'Stocks',
      path: '/stocks-bullish-bearish',
    },
    {
      icon: <CurrencyBitcoin />,
      label: 'Crypto',
      path: '/crypto-bullish-bearish',
    },
    {
      icon: <AccountBalance />,
      label: 'Bonds',
      path: '/treasury-bullish-bearish',
    },
    {
      icon: <BubbleChart />,
      label: 'AI Bubble',
      path: '/ai-bubble',
    },
    {
      icon: <TrendingUp />,
      label: 'Capital Flows',
      path: '/capital-flow',
    },
    {
      icon: <Gavel />,
      label: 'Fed Policy',
      path: '/fed-dovish-hawkish',
    },
  ];

  const currentTabIndex = menuList.findIndex((item) => item.path === location.pathname);
  const activeTabValue = currentTabIndex >= 0 ? currentTabIndex : 0;

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
                    value={activeTabValue}
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
                        selected={index === activeTabValue}
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

        <Outlet />
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
