import React from 'react';

import DashboardLayout from './dashboard.layout';
import { DashboardProvider } from './dashboard.provider';

const Dashboard: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  );
};

export default Dashboard;
