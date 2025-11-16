import {
  createContext,
} from 'react';

import type { IFedPolicyContext } from '../interfaces/fed-policy';

const FedPolicyContext = createContext<IFedPolicyContext>({
  isLoadingFedPolicy: false,
  cpiInflation: undefined,
  corePce: undefined,
  unemploymentRate: undefined,
  averageHourlyEarnings: undefined,
  federalFundsRate: undefined,
  refetchFedPolicyData: () => {},
  updateFedPolicy: () => {},
});

export default FedPolicyContext;
