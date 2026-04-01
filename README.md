# Scorecards

[![Tests](https://github.com/cristiangiuliani/scorecards/actions/workflows/test.yml/badge.svg)](https://github.com/cristiangiuliani/scorecards/actions/workflows/test.yml)
[![Build](https://github.com/cristiangiuliani/scorecards/actions/workflows/netifly-hosting.yml/badge.svg)](https://github.com/cristiangiuliani/scorecards/actions/workflows/netifly-hosting.yml)
[![codecov](https://codecov.io/gh/cristiangiuliani/scorecards/branch/main/graph/badge.svg)](https://codecov.io/gh/cristiangiuliani/scorecards)

An automated market reversal analysis system that provides real-time scoring and analysis for stocks, cryptocurrency, AI bubble indicators, US Treasury bonds, capital flows, and Fed policy.

**Live Demo:** https://scorecards.cristiangiuliani.com/

---

## ⚠️ Important Disclaimer

**This is an experimental project developed with AI assistance (Anthropic Claude).**

- This project was developed as an experiment using AI-assisted development with **Anthropic Claude**
- The software development process was **supervised and reviewed** by me (Cristian Giuliani)
- **All calculation logic and scoring algorithms were entirely delegated to the AI**, as I do not possess the necessary financial expertise
- The scoring methodologies, investment strategies, and recommendations **may not be reliable or accurate**
- **This tool is for educational and experimental purposes only**
- **DO NOT use this tool for making real investment decisions**
- I am not a financial advisor, and this project does not constitute financial advice
- Always consult with qualified financial professionals before making investment decisions

By using this application, you acknowledge that you understand and accept these limitations.

---

## Overview

Scorecards is a React-based web application that analyzes market indicators and provides automated scoring to help identify potential market reversals and investment opportunities. The system tracks multiple technical indicators including RSI, Fear & Greed indices, market dominance, volatility metrics, treasury yields, credit spreads, and inflation expectations across different asset classes.

## Features

- **Multi-Market Analysis**
  - **Stocks** - S&P 500, VIX, EUR/USD, RSI, Fear & Greed Index
  - **Cryptocurrency** - Bitcoin, BTC Dominance, Crypto Fear & Greed Index
  - **AI Bubble Indicators** - NVIDIA P/E, NASDAQ P/E ratios, VIX persistence
  - **Treasury Bonds** - 10Y/5Y/2Y yields, yield curve, credit spreads, inflation expectations
  - **Capital Flows** - Fed balance sheet, M2 money supply, Dollar Index, gold, stablecoin reserves, crypto market cap
  - **Fed Policy Outlook** - CPI inflation, Core PCE, unemployment, wage growth, Fed Funds rate

- **Automated Scoring System**
  - Weighted scoring algorithms for each asset class (-4 to +4 scale)
  - Color-coded severity indicators (Success/Warning/Error)
  - Visual scorecards with interpretation labels
  - Strategy recommendations based on market conditions

- **Intelligent Caching**
  - MongoDB-based caching for API responses
  - Configurable TTL per data source
  - Manual refresh via `?refresh=true`
  - Cache status headers (`X-Cache`, `X-Cache-Expires-At`, `X-Cache-Created-At`)
  - Visual expiration countdown timers in the UI

- **Modern UI**
  - Dark mode interface
  - Material-UI components
  - Responsive design
  - Tab-based navigation between market types
  - Skeleton loaders for improved perceived performance

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Material-UI (MUI) 7** - Component library
- **React Router 7** - Navigation
- **Vite 7** - Build tool and dev server
- **Technical Indicators** - Market calculation library

### Testing
- **Jest 30 + ts-jest** - Unit testing with TypeScript
- **342 unit tests** covering all formulas and interpretations
- **CI/CD Integration** - Automated testing on every PR and push
- See [TESTING.md](./TESTING.md) for detailed testing documentation

### Backend
- **Netlify Functions** - Serverless API endpoints
- **MongoDB** - Data caching with TTL management
- **FRED API** - Federal Reserve Economic Data (Treasury bonds, inflation, capital flows)
- **Yahoo Finance API** - Stock market data (S&P 500, VIX, EUR/USD)
- **CoinGecko API** - Cryptocurrency data
- **Fear & Greed Index APIs** - Market sentiment indicators
- **Financial Modeling Prep** - NVIDIA P/E ratio

### Development Tools
- **ESLint** - Code linting (Airbnb config)
- **Yarn 4** - Package management

## Project Structure

```
Scorecards/
├── src/
│   ├── dashboard/              # Main dashboard component
│   ├── market-stocks/          # Traditional market analysis
│   ├── market-crypto/          # Cryptocurrency market analysis
│   ├── market-bubble/          # AI bubble indicators
│   ├── market-treasury-bonds/  # Treasury bonds analysis
│   ├── market-capital-flows/   # Capital flows analysis
│   ├── fed-policy/             # Fed Policy outlook
│   ├── shared/                 # Shared components and hooks
│   ├── error-handler/          # Error management system
│   ├── constants/              # Configuration and API definitions
│   ├── interfaces/             # TypeScript interfaces
│   └── _mocks/                 # Mock data for development
├── netlify/
│   └── functions/              # Serverless API functions
│       └── utils/              # Caching and proxy utilities
├── CLAUDE.md                   # Claude Code guidance
├── FRED_API_SETUP.md           # FRED API setup guide
└── .env.example                # Environment variables template
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Scorecards
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables by creating a `.env.local` file (see `.env.example`):
```bash
# MongoDB for caching
MONGODB_URI=your_mongodb_connection_string

# FRED API for Treasury Bonds, Capital Flows, Fed Policy (FREE)
FRED_API_KEY=your_fred_api_key
```

**Getting a FRED API Key (Free):** See [FRED_API_SETUP.md](FRED_API_SETUP.md) for instructions.

4. Run the development server with Netlify functions:
```bash
yarn dev:netlify
```

## Available Scripts

- `yarn dev` - Start Vite development server (no API functions)
- `yarn dev:netlify` - Start Netlify dev environment with functions
- `yarn build` - Build for production (TypeScript + Vite)
- `yarn lint` - Run ESLint
- `yarn test` - Run all Jest tests
- `yarn test:coverage` - Run tests with coverage report
- `yarn preview` - Preview production build
- `yarn deploy:netlify` - Deploy to Netlify production

## API Endpoints

All endpoints support automatic MongoDB caching, force refresh via `?refresh=true`, and CORS headers.

### Stock Market
- `/api/fetchSP500` - S&P 500 historical data (Yahoo Finance)
- `/api/fetchVix` - VIX volatility index (Yahoo Finance)
- `/api/fetchFearGreed` - Traditional markets Fear & Greed
- `/api/fetchEurUsd` - EUR/USD exchange rate (Yahoo Finance)
- `/api/fetchPeRatioNvda` - NVIDIA P/E ratio (Financial Modeling Prep)

### Cryptocurrency
- `/api/fetchBtc` - Bitcoin market data (CoinGecko)
- `/api/fetchBtcDominance` - Bitcoin dominance percentage (CoinGecko)
- `/api/fetchBtcFearGreed` - Crypto Fear & Greed Index
- `/api/fetchBtcRsi` - Bitcoin RSI calculation (CoinGecko)

### Treasury Bonds
- `/api/fetchFredDGS10` - 10-Year Treasury Yield — `DGS10`
- `/api/fetchFredDGS5` - 5-Year Treasury Yield — `DGS5`
- `/api/fetchFredDGS2` - 2-Year Treasury Yield — `DGS2`
- `/api/fetchFredBAML` - ICE BofA Corporate Credit Spreads — `BAMLC0A0CM`
- `/api/fetchFredT10YIE` - 10-Year Breakeven Inflation Rate — `T10YIE`

### Capital Flows
- `/api/fetchFredWALCL` - Fed Total Assets / Balance Sheet — `WALCL`
- `/api/fetchFredM2` - M2 Money Supply — `M2SL`
- `/api/fetchFredDollarIndex` - Trade Weighted US Dollar Index — `DTWEXBGS`
- `/api/fetchFredGold` - Gold price (FRED)
- `/api/fetchStablecoins` - Stablecoin market cap (CoinGecko)
- `/api/fetchGlobalCryptoData` - Total crypto market cap (CoinGecko)

### Fed Policy Outlook
- `/api/fetchFredCPI` - Consumer Price Index — `CPIAUCSL`
- `/api/fetchFredPCE` - Core PCE Price Index — `PCEPILFE`
- `/api/fetchFredUnemployment` - Unemployment Rate — `UNRATE`
- `/api/fetchFredWages` - Average Hourly Earnings — `CES0500000003`
- `/api/fetchFredFedFunds` - Federal Funds Effective Rate — `FEDFUNDS`

## Configuration

### Cache Configuration
Cache TTLs are managed in `netlify/functions/utils/cacheConfig.ts`.

### NASDAQ P/E Ratio
No free API exists for the NASDAQ 100 P/E ratio. It is hardcoded in `src/constants/config.ts` and must be updated manually (or via the `/update-nasdaq-pe` slash command in Claude Code) from [GuruFocus](https://www.gurufocus.com/economic_indicators/6778/nasdaq-100-pe-ratio).

## Deployment

```bash
yarn build
yarn deploy:netlify
```

Set these environment variables in your Netlify dashboard:
- `MONGODB_URI` - MongoDB connection string
- `FRED_API_KEY` - Federal Reserve Economic Data API key

## Author

**Cristian Giuliani**
- Email: info@cristiangiuliani.com

## License

Private project — Version 0.2.0

## Resources

- **FRED API Documentation**: https://fred.stlouisfed.org/docs/api/fred/
- **FRED Data Browser**: https://fred.stlouisfed.org/
- **FRED API Setup Guide**: [FRED_API_SETUP.md](FRED_API_SETUP.md)
