import React from 'react';

import FedPolicyContainer from './fed-policy.container';
import { FedPolicyProvider } from './fed-policy.provider';

const FedPolicy: React.FC = () => {
  return (
    <FedPolicyProvider>
      <FedPolicyContainer />
    </FedPolicyProvider>
  );
};

export default FedPolicy;
