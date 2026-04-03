import {
  useState, type ReactNode,
} from 'react';

import type { IFedPolicyProvider } from '../interfaces/fed-policy';

import FedPolicyContext, { FED_POLICY_INITIAL_STATE } from './fed-policy.context';

export const FedPolicyProvider = ({
  children,
}: { children: ReactNode }) => {
  const [fedPolicy, setFedPolicy] = useState<IFedPolicyProvider>(FED_POLICY_INITIAL_STATE);

  const updateFedPolicy = (newState: IFedPolicyProvider = FED_POLICY_INITIAL_STATE) => {
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
