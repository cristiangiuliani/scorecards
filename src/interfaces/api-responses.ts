// Yahoo Finance API Response Types
export interface IYahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
      };
      indicators: {
        quote: Array<{
          close: number[];
          volume: number[];
        }>;
      };
    }>;
  };
}

// Alpha Vantage RSI Response
export interface IAlphaVantageRSIResponse {
  'Information': string;
  'Meta Data': {
    '3: Last Refreshed': string;
  };
  'Technical Analysis: RSI': {
    [date: string]: {
      RSI: string;
    };
  };
}

// Alpha Vantage Currency Exchange Response
export interface IAlphaVantageCurrencyResponse {
  'Information': string;
  'Realtime Currency Exchange Rate': {
    '5. Exchange Rate': string;
  };
}

// Fear & Greed Index Response
export interface IFearGreedResponse {
  fear_and_greed: {
    score: number;
  };
}

// Bitcoin Response (CoinGecko)
export interface IBitcoinResponse {
  market_data: {
    current_price: {
      usd: number;
    };
    ath: {
      usd: number;
    };
  };
}

// Bitcoin Dominance Response
export interface IBitcoinDominanceResponse {
  data: {
    market_cap_percentage: {
      btc: number;
    };
  };
}

// Bitcoin RSI Response
export interface IBitcoinRSIResponse {
  prices: Array<[number, number]>;
  data: {
    total_volumes: Array<[number, number]>;
  };
}

// Bitcoin Fear & Greed Response
export interface IBitcoinFearGreedResponse {
  data: Array<{
    value: string;
  }>;
}

// Financial Modeling Prep API Response Types
export interface IFinancialModelingPrepResponse {
  symbol: string;
  priceToEarningsRatioTTM: number;
}
