export interface IMarketTreasuryBondsContext extends IMarketTreasuryBondsProvider {
  updateMarketTreasuryBonds: (newState: IMarketTreasuryBondsProvider) => void;
}

export interface IBondsData {
  yield10Y?: number;
  yield5Y?: number;
  yield2Y?: number;
  yieldCurveSlope?: number;
  creditSpreads?: number;
  inflationExpectations?: number;
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface IBondsDataStatus extends IBondsData {
  isYield10YLoading?: boolean;
  isYield5YLoading?: boolean;
  isYield2YLoading?: boolean;
  isSpreadsLoading?: boolean;
  isInflationLoading?: boolean;
}

export interface IMarketTreasuryBondsProvider extends IBondsDataStatus {
  isLoadingBonds?: boolean;
  refetchMarketBondsData?: () => void;
}
