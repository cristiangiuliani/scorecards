import React from 'react';

import DashboardContainer from './containers/dashboard.container';
import { DashboardProvider } from './providers/dashboard.provider';

const Dashboard: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContainer />
    </DashboardProvider>
  );
};

export default Dashboard;
