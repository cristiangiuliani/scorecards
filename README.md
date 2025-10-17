# Scorecards

An automated market reversal analysis system that provides real-time scoring and analysis for both traditional markets (stocks) and cryptocurrency markets.

## Overview

Scorecards is a React-based web application that analyzes market indicators and provides automated scoring to help identify potential market reversals. The system tracks multiple technical indicators including RSI, Fear & Greed indices, market dominance, and volatility metrics across different asset classes.

## Features

- **Dual Market Analysis**
  - Traditional Markets (S&P 500, VIX, EUR/USD, RSI)
  - Cryptocurrency Markets (Bitcoin, BTC Dominance, Fear & Greed Index)

- **Real-time Scoring System**
  - Automated calculation of market reversal signals
  - Color-coded severity indicators (Success/Warning/Error)
  - Visual scorecards with interpretation labels

- **Technical Indicators**
  - Relative Strength Index (RSI)
  - Fear & Greed Index
  - Bitcoin Dominance
  - VIX (Volatility Index)
  - Currency pair analysis (EUR/USD)

- **Intelligent Caching**
  - MongoDB-based caching for API responses
  - Configurable TTL for different data sources
  - Manual refresh capability

- **Modern UI**
  - Dark mode interface
  - Material-UI components
  - Responsive design
  - Tab-based navigation between market types

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
- **MongoDB** - Data caching
- **CoinGecko API** - Cryptocurrency data
- **Various Market Data APIs** - Stock and traditional market data

### Development Tools
- **ESLint** - Code linting (Airbnb config)
- **TypeScript ESLint** - TypeScript-specific linting
- **Yarn 4** - Package management

## Project Structure

```
Scorecards/
├── src/
│   ├── dashboard/           # Main dashboard component
│   ├── market-crypto/       # Cryptocurrency market analysis
│   ├── market-stocks/       # Traditional market analysis
│   ├── shared/              # Shared components and hooks
│   ├── error-handler/       # Error management system
│   ├── constants/           # Configuration and API definitions
│   ├── interfaces/          # TypeScript interfaces
│   ├── types/               # TypeScript type definitions
│   └── _mocks/              # Mock data for development
├── netlify/
│   └── functions/           # Serverless API functions
│       ├── utils/           # Caching and proxy utilities
│       └── fetch*.ts        # Individual API endpoints
├── public/                  # Static assets
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
Create a `.env.local` file in the root directory with:
```
MONGODB_URI=your_mongodb_connection_string
```

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

- `/api/fetchBtc` - Bitcoin market data
- `/api/fetchBtcDominance` - Bitcoin dominance percentage
- `/api/fetchBtcFearGreed` - Crypto Fear & Greed Index
- `/api/fetchBtcRsi` - Bitcoin RSI calculation
- `/api/fetchSP500` - S&P 500 data
- `/api/fetchVix` - VIX volatility index
- `/api/fetchFearGreed` - Traditional markets Fear & Greed
- `/api/fetchRsiSP500` - S&P 500 RSI
- `/api/fetchEurUsd` - EUR/USD exchange rate

All endpoints support:
- Automatic caching with configurable TTL
- Force refresh via `?refresh=true` query parameter
- CORS headers for cross-origin requests

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

## Author

**Cristian Giuliani**
- Email: info@cristiangiuliani.com

## License

Private project - Version 0.1.0

## Recent Updates

- Fixed chart undefined error handling
- Updated error messaging with snackbar notifications
- Integrated MongoDB for API response caching
- Implemented Netlify API hooks for data fetching
- Removed unused UI components
