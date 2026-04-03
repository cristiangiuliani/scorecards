import {
  createContext,
} from 'react';

import type {
  IFedPolicyContext,
  IFedPolicyProvider,
} from '../interfaces/fed-policy';

export const FED_POLICY_INITIAL_STATE: IFedPolicyProvider = {
  isLoadingFedPolicy: false,
  cpiInflation: undefined,
  corePce: undefined,
  unemploymentRate: undefined,
  averageHourlyEarnings: undefined,
  federalFundsRate: undefined,
  cacheCreatedAt: undefined,
  cacheExpiresAt: undefined,
  isCpiLoading: false,
  isCorePceLoading: false,
  isUnemploymentLoading: false,
  isEarningsLoading: false,
  isFedFundsLoading: false,
  refetchFedPolicyData: () => {},
};

const FedPolicyContext = createContext<IFedPolicyContext>({
  ...FED_POLICY_INITIAL_STATE,
  updateFedPolicy: () => {},
});

export default FedPolicyContext;
