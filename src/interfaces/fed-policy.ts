export interface IFedPolicyContext extends IFedPolicyProvider  {
    updateFedPolicy: (newState: IFedPolicyProvider) => void;
};

export interface IFedPolicyData {
  cpiInflation?: number;
  corePce?: number;
  unemploymentRate?: number;
  averageHourlyEarnings?: number;
  federalFundsRate?: number;
  fedFundsTarget?: number;
  cacheCreatedAt?: string | null;
  cacheExpiresAt?: string | null;
}

export interface IFedPolicyDataStatus extends IFedPolicyData {
  isCpiLoading?: boolean;
  isCorePceLoading?: boolean;
  isUnemploymentLoading?: boolean;
  isEarningsLoading?: boolean;
  isFedFundsLoading?: boolean;
}

export interface IFedPolicyProvider extends IFedPolicyDataStatus {
  isLoadingFedPolicy?: boolean;
  refetchFedPolicyData?: () => void;
}
