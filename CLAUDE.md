# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn dev                  # Vite dev server only
yarn dev:netlify          # Vite + Netlify functions (needed for API calls)

# Build & Deploy
yarn build                # TypeScript compile + Vite build
yarn deploy:netlify       # Deploy to Netlify

# Testing
yarn test                 # Run all Jest tests
yarn test:watch           # Watch mode
yarn test:coverage        # With coverage report
yarn test stocks-formulas # Run a specific test file by name pattern

# Linting
yarn lint                 # ESLint (Airbnb config, zero warnings allowed in CI)
```

## Architecture

**Scorecards** is a React SPA deployed on Netlify that calculates and displays market reversal scores for 6 financial markets: Stocks, Crypto, AI Bubble, Treasury Bonds, Capital Flows, and Fed Policy.

### Data Flow

```
React SPA → useNetlifyApi hook → Netlify Serverless Functions → External APIs
                                         ↓
                               MongoDB Cache (2h TTL)
```

The Vite dev server proxies `/scorecards/api/*` → `http://localhost:8888/.netlify/functions/*`. Run `yarn dev:netlify` (not `yarn dev`) to use live API data during development.

### Module Pattern

Every market module follows the same file structure:

```
market-<name>/
├── market-<name>.tsx              # Entry: composes Provider + Container
├── market-<name>.provider.tsx     # React Context + state
├── market-<name>.context.ts       # Context definition
├── market-<name>.container.tsx    # Data fetching + score calculation
├── market-<name>.component.tsx    # Pure UI rendering
└── utils/
    ├── <name>-formulas.ts         # Score calculations (-4 to +4)
    ├── <name>-interpretation.ts   # Text/color/strategy from scores
    └── __tests__/
```

### Scoring System

Each market produces a composite score from **-4 (very bearish) to +4 (very bullish)**:

1. **Formulas layer** (`*-formulas.ts`): Raw market data → individual indicator scores (-4 to +4)
2. **Interpretation layer** (`*-interpretation.ts`): Scores → human-readable text, color severity, and strategy recommendations
3. **Composite**: `Σ(score × weight) / Σ(weights)` — weights defined in `src/constants/config.ts`

### API / Caching Layer

All Netlify functions use `netlify/functions/utils/cachedProxy.ts`, which wraps any URL-builder function with:
- MongoDB-backed caching (default 2h TTL, configured per-endpoint in `cacheConfig.ts`)
- `X-Cache: HIT/MISS/REFRESHED` response headers
- `?refresh=true` query param to bypass cache
- CORS headers on all responses

### Environment Variables

- `MONGODB_URI` — MongoDB connection string for the caching layer
- `FRED_API_KEY` — Federal Reserve Economic Data API key (free, from [fred.stlouisfed.org](https://fred.stlouisfed.org/))

Local development uses `.env.local`; production uses `.env.production`.

### Testing

Tests live in `__tests__/` subdirectories alongside the code they test. Coverage is collected only from `*-formulas.ts` and `*-interpretation.ts` utility files. CI enforces minimum thresholds (30% branches, 45% functions/lines). Mock API response data is in `src/_mocks/`.
