export interface IMarketCapitalFlowsContext extends IMarketCapitalFlowsProvider {
  updateMarketCapitalFlows: (newState: IMarketCapitalFlowsProvider) => void;
}

export interface ICapitalFlowsData {
  // FRED Macro Indicators (current values)
  fedBalanceSheet?: number; // WALCL - Fed Balance Sheet
  m2MoneySupply?: number; // WM2NS - M2 Money Supply
  dollarIndex?: number; // DTWEXBGS - US Dollar Index
  highYieldSpread?: number; // BAMLH0A0HYM2 - High Yield Spread
  goldPrice?: number; // GOLDAMGBD228NLBM - Gold Price (actually Treasury 10Y)

  // Historical data arrays for calculations
  fedBalanceSheetHistory?: number[];
  m2MoneySupplyHistory?: number[];
  dollarIndexHistory?: number[];
  highYieldSpreadHistory?: number[];
  treasury10YHistory?: number[];

  // CoinGecko Crypto Indicators
  stablecoinMarketCap?: number; // Total USDT + USDC market cap
  totalCryptoMarketCap?: number; // Total crypto market cap
  stablecoinDominance?: number; // Stablecoin % of total crypto
  cryptoMarketCapHistory?: number[];

  // Cache info
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface ICapitalFlowsDataStatus extends ICapitalFlowsData {
  isFedBalanceSheetLoading?: boolean;
  isM2MoneySupplyLoading?: boolean;
  isDollarIndexLoading?: boolean;
  isHighYieldSpreadLoading?: boolean;
  isGoldPriceLoading?: boolean;
  isStablecoinMarketCapLoading?: boolean;
  isTotalCryptoMarketCapLoading?: boolean;
}

export interface IMarketCapitalFlowsProvider extends ICapitalFlowsDataStatus {
  isLoadingCapitalFlows?: boolean;
  refetchMarketCapitalFlowsData?: () => void;
}
