
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
  CssBaseline,
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  green, grey, orange, red,
} from '@mui/material/colors';
import {
  createTheme, ThemeProvider,
} from '@mui/material/styles';
import React from 'react';
import {
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom';

import { DisclaimerComponent } from '../shared/components/disclaimer.component';
import { ErrorDisplay } from '../shared/components/error-display';

declare module '@mui/material/styles' {
  interface PaletteColor {
    gradient?: string;
    darkGradient?: string;
  }
  interface SimplePaletteColorOptions {
    gradient?: string;
    darkGradient?: string;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    success: {
      main: green[500],
      dark: green[700],
      light: green[300],
      gradient: `linear-gradient(to bottom, ${green[500]}, ${green[900]})`,
      darkGradient: `linear-gradient(to bottom, ${green[900]}, transparent)`,
    },
    error: {
      main: red[500],
      dark: red[700],
      light: red[300],
      gradient: `linear-gradient(to bottom, ${red[500]}, ${red[800]})`,
      darkGradient: `linear-gradient(to bottom, ${red[900]}, transparent)`,
    },
    warning: {
      main: orange[500],
      dark: orange[700],
      light: orange[300],
      gradient: `linear-gradient(to bottom, ${orange[500]}, ${orange[800]})`,
      darkGradient: `linear-gradient(to bottom, ${orange[900]}, transparent)`,
    },
    info: {
      main: grey[500],
      dark: grey[700],
      light: grey[300],
      gradient: `linear-gradient(to bottom, ${grey[500]}, ${grey[800]})`,
      darkGradient: `linear-gradient(to bottom, ${grey[800]}, transparent)`,
    },
  },
});
const DashboardLayout: React.FC = () => {
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
      path: '/stocks-bullish-bearish-indicator',
    },
    {
      icon: <CurrencyBitcoin />,
      label: 'Crypto',
      path: '/crypto-bullish-bearish-indicator',
    },
    {
      icon: <AccountBalance />,
      label: 'Bonds',
      path: '/treasury-bonds-buy-sell-indicator',
    },
    {
      icon: <BubbleChart />,
      label: 'AI Bubble',
      path: '/ai-bubble-risk-indicator',
    },
    {
      icon: <TrendingUp />,
      label: 'Capital Flows',
      path: '/capital-inflow-outflow-indicator',
    },
    {
      icon: <Gavel />,
      label: 'Fed Policy',
      path: '/fed-dovish-hawkish-indicator',
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
          minHeight: '100vh',
          padding: {
            xs: 0,
            sm: '0 1rem',
          },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,

          }}

        >
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>

              <Grid
                container
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
                    slotProps={{

                      indicator: {
                        sx: {
                          display: 'none',
                        },
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
        <Outlet />
        <Grid container mb={2} sx={{ opacity: 0.7 }}>
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
                variant="text"
                disableRipple
                sx={{
                  fontSize: 'inherit',
                  textTransform: 'none',
                  color: 'inherit',
                }}
                startIcon={<GitHub fontSize="inherit" />}
                onClick={() => window.open('https://github.com/cristiangiuliani/scorecards', '_blank')}
              >
                GitHub Repository
              </Button>&nbsp;|&nbsp;
              <Button
                variant="text"
                disableRipple
                sx={{
                  fontSize: 'inherit',
                  textTransform: 'none',
                  color: 'inherit',
                }}
                startIcon={<Home fontSize="inherit" />}
                onClick={() => window.open('https://www.cristiangiuliani.com', '_blank')}
              >
                Author Website
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <DisclaimerComponent />
    </ThemeProvider>
  );
};

export default DashboardLayout;
