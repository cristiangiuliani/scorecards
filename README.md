# Scorecards

An automated market reversal analysis system that provides real-time scoring and analysis for stocks, cryptocurrency, AI bubble indicators, and US Treasury bonds markets.

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

- **Automated Scoring System**
  - Automated calculation of market reversal signals
  - Weighted scoring algorithms for each asset class
  - Color-coded severity indicators (Success/Warning/Error)
  - Visual scorecards with interpretation labels
  - Strategy recommendations based on market conditions

- **Treasury Bonds Analysis** ⭐ NEW
  - Real-time US Treasury yields (10Y, 5Y, 2Y)
  - Yield curve slope monitoring (inversion detection)
  - Corporate credit spreads (ICE BofA Index)
  - Inflation expectations (10Y breakeven rate)
  - Duration strategy recommendations
  - Sector allocation guidance
  - Powered by **free FRED API** (Federal Reserve Economic Data)

- **Technical Indicators**
  - Relative Strength Index (RSI)
  - Fear & Greed Index (Stocks & Crypto)
  - Bitcoin Dominance
  - VIX (Volatility Index)
  - Currency pair analysis (EUR/USD)
  - ATH distance tracking
  - Momentum indicators
  - Moving averages

- **Intelligent Caching**
  - MongoDB-based caching for API responses
  - Configurable TTL for different data sources
  - Manual refresh capability
  - Real-time cache expiration tracking with countdown timers
  - Visual expiration date display

- **AI Bubble Indicators**
  - AI market bubble detection and tracking
  - Visual indicators for AI-driven market trends
  - P/E ratio analysis (NVIDIA vs NASDAQ)
  - VIX persistence monitoring

- **Modern UI**
  - Dark mode interface
  - Material-UI components
  - Responsive design
  - Tab-based navigation between market types
  - Skeleton loaders for improved perceived performance
  - Data freshness indicators with countdown timers

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Vite** - Build tool and dev server
- **Technical Indicators** - Market calculation library

### Backend
- **Netlify Functions** - Serverless API endpoints
- **MongoDB** - Data caching with TTL management
- **FRED API** - Federal Reserve Economic Data (Treasury bonds, inflation, credit spreads)
- **Yahoo Finance API** - Stock market data (S&P 500, VIX)
- **Alpha Vantage API** - Technical indicators (RSI, EUR/USD)
- **CoinGecko API** - Cryptocurrency data
- **Fear & Greed Index APIs** - Market sentiment indicators
- **TypeScript Types** - Strongly typed API responses

### Development Tools
- **ESLint** - Code linting (Airbnb config)
- **TypeScript ESLint** - TypeScript-specific linting
- **Yarn 4** - Package management

## Project Structure

```
Scorecards/
├── src/
│   ├── dashboard/              # Main dashboard component
│   ├── market-crypto/          # Cryptocurrency market analysis
│   ├── market-stocks/          # Traditional market analysis
│   ├── market-bubble/          # AI bubble indicators
│   ├── market-treasury-bonds/  # Treasury bonds analysis ⭐ NEW
│   │   ├── utils/
│   │   │   ├── bonds-formulas.ts       # Score calculations
│   │   │   └── bonds-interpretation.ts # Strategy recommendations
│   │   ├── market-treasury-bonds.tsx
│   │   ├── market-treasury-bonds.container.tsx
│   │   ├── market-treasury-bonds.component.tsx
│   │   ├── market-treasury-bonds.provider.tsx
│   │   └── market-treasury-bonds.context.ts
│   ├── shared/              # Shared components and hooks
│   ├── error-handler/       # Error management system
│   ├── constants/           # Configuration and API definitions
│   ├── interfaces/          # TypeScript interfaces
│   ├── types/               # TypeScript type definitions
│   └── _mocks/              # Mock data for development
├── netlify/
│   └── functions/           # Serverless API functions
│       ├── utils/           # Caching and proxy utilities
│       ├── fetch*.ts        # Stock/Crypto API endpoints
│       ├── fetchFredDGS10.ts   # FRED 10Y Treasury ⭐ NEW
│       ├── fetchFredDGS5.ts    # FRED 5Y Treasury ⭐ NEW
│       ├── fetchFredDGS2.ts    # FRED 2Y Treasury ⭐ NEW
│       ├── fetchFredBAML.ts    # FRED Credit Spreads ⭐ NEW
│       └── fetchFredT10YIE.ts  # FRED Inflation ⭐ NEW
├── public/                  # Static assets
├── FRED_API_SETUP.md       # FRED API setup guide ⭐ NEW
├── .env.example            # Environment variables template ⭐ NEW
└── dist/                    # Production build output
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

3. Set up environment variables:
Create a `.env` file in the root directory (see `.env.example`):
```bash
# MongoDB for caching
MONGODB_URI=your_mongodb_connection_string

# FRED API for Treasury Bonds (FREE - see FRED_API_SETUP.md)
FRED_API_KEY=your_fred_api_key
```

**Getting a FRED API Key (Free):**
See [FRED_API_SETUP.md](FRED_API_SETUP.md) for detailed instructions on obtaining your free FRED API key from the Federal Reserve Bank of St. Louis.

4. Run the development server:
```bash
yarn dev
```

Or run with Netlify functions:
```bash
yarn dev:netlify
```

## Available Scripts

- `yarn dev` - Start Vite development server
- `yarn dev:netlify` - Start Netlify dev environment with functions
- `yarn build` - Build for production (TypeScript + Vite)
- `yarn lint` - Run ESLint
- `yarn preview` - Preview production build
- `yarn deploy:netlify` - Deploy to Netlify production
- `yarn setup:tssdk` - Setup TypeScript SDK for VSCode

## API Endpoints

The application uses Netlify Functions as serverless API endpoints:

### Stock Market Endpoints
- `/api/fetchSP500` - S&P 500 data (Yahoo Finance)
- `/api/fetchVix` - VIX volatility index (Yahoo Finance)
- `/api/fetchFearGreed` - Traditional markets Fear & Greed
- `/api/fetchRsiSP500` - S&P 500 RSI (Alpha Vantage)
- `/api/fetchEurUsd` - EUR/USD exchange rate (Alpha Vantage)
- `/api/fetchPeRatioNvda` - NVIDIA P/E ratio (Financial Modeling Prep)

### Cryptocurrency Endpoints
- `/api/fetchBtc` - Bitcoin market data (CoinGecko)
- `/api/fetchBtcDominance` - Bitcoin dominance percentage (CoinGecko)
- `/api/fetchBtcFearGreed` - Crypto Fear & Greed Index
- `/api/fetchBtcRsi` - Bitcoin RSI calculation (CoinGecko)

### Treasury Bonds Endpoints ⭐ NEW
- `/api/fetchFredDGS10` - 10-Year Treasury Yield (FRED API)
- `/api/fetchFredDGS5` - 5-Year Treasury Yield (FRED API)
- `/api/fetchFredDGS2` - 2-Year Treasury Yield (FRED API)
- `/api/fetchFredBAML` - ICE BofA Corporate Credit Spreads (FRED API)
- `/api/fetchFredT10YIE` - 10-Year Breakeven Inflation Rate (FRED API)

**FRED Series Codes Used:**
- `DGS10` - 10-Year Treasury Constant Maturity Rate
- `DGS5` - 5-Year Treasury Constant Maturity Rate
- `DGS2` - 2-Year Treasury Constant Maturity Rate
- `BAMLC0A0CM` - ICE BofA US Corporate Index Option-Adjusted Spread
- `T10YIE` - 10-Year Breakeven Inflation Rate

All endpoints support:
- Automatic caching with configurable TTL (MongoDB)
- Force refresh via `?refresh=true` query parameter
- CORS headers for cross-origin requests
- Cache hit/miss/refresh headers (`X-Cache`, `X-Cache-Expires-At`, `X-Cache-Created-At`)

## Configuration

### Cache Configuration
Cache settings are managed in `netlify/functions/utils/cacheConfig.ts`:
- Default TTL for API responses
- MongoDB collection names
- Cache expiration policies

### API Configuration
API endpoints are defined in `src/constants/api.ts` with:
- Function names for each endpoint
- Mock data for development/demo mode

## Development

### Demo Mode
The application includes a demo mode that uses mock data when API calls fail or during development. Mock data files are located in `src/_mocks/`.

### Error Handling
Centralized error handling system with:
- Error context provider
- Snackbar notifications
- Error display component
- Service layer for error management

## Deployment

The application is configured for deployment on Netlify:

1. Build the project:
```bash
yarn build
```

2. Deploy to Netlify:
```bash
yarn deploy:netlify
```

### Environment Variables (Production)
Ensure these are set in your Netlify dashboard:
- `MONGODB_URI` - MongoDB connection string for caching
- `FRED_API_KEY` - Federal Reserve Economic Data API key (free, see FRED_API_SETUP.md)

## Author

**Cristian Giuliani**
- Email: info@cristiangiuliani.com

## License

Private project - Version 0.2.0

## Recent Updates

### v0.2.0 - Treasury Bonds Section ⭐ NEW
- **Added Treasury Bonds Analysis** - Complete new section for US Treasury bonds market
  - Real-time yields for 10Y, 5Y, and 2Y treasuries
  - Yield curve slope monitoring with inversion detection
  - Corporate credit spreads tracking (ICE BofA Index)
  - Inflation expectations from 10-year breakeven rate
  - Duration strategy recommendations
  - Sector allocation guidance
  - Powered by free FRED API (Federal Reserve Economic Data)
- **5 FRED API integrations** - Added Netlify functions for DGS10, DGS5, DGS2, BAMLC0A0CM, T10YIE
- **New scoring algorithm** - Weighted scoring for treasury bonds with 6 indicators
- **Strategy recommendations** - Actionable tips based on bond market conditions

### v0.1.0
- **Added AI bubble indicators** - Visual detection and tracking of AI-driven market trends
- **Improved cache management** - Added expiration date display and countdown timers
- **Enhanced type safety** - Added comprehensive API response types
- **Better UX** - Skeleton loaders during data retrieval for improved perceived performance
- Fixed chart undefined error handling
- Updated error messaging with snackbar notifications
- Integrated MongoDB for API response caching
- Implemented Netlify API hooks for data fetching

## Resources

- **FRED API Documentation**: [https://fred.stlouisfed.org/docs/api/fred/](https://fred.stlouisfed.org/docs/api/fred/)
- **FRED Data Browser**: [https://fred.stlouisfed.org/](https://fred.stlouisfed.org/)
- **Treasury Bonds Setup Guide**: [FRED_API_SETUP.md](FRED_API_SETUP.md)
