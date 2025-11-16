import {
  useState, type ReactNode,
} from 'react';

import type { IFedPolicyProvider } from '../interfaces/fed-policy';

import FedPolicyContext from './fed-policy.context';

export const FedPolicyProvider = ({
  children,
}: { children: ReactNode }) => {
  const fedPolicyProviderValue = {
    isLoadingFedPolicy: false,
    cpiInflation: undefined,
    corePce: undefined,
    unemploymentRate: undefined,
    averageHourlyEarnings: undefined,
    federalFundsRate: undefined,
    cacheCreatedAt: undefined,
    cacheExpiresAt: undefined,
    refetchFedPolicyData: () => {},
  };
  const [fedPolicy, setFedPolicy] = useState<IFedPolicyProvider>(fedPolicyProviderValue);

  const updateFedPolicy = (newState: IFedPolicyProvider = fedPolicyProviderValue) => {
    setFedPolicy((prevState: IFedPolicyProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <FedPolicyContext.Provider value={{
      ...fedPolicy,
      updateFedPolicy,
    }}
    >
      { children }
    </FedPolicyContext.Provider>
  );
};
