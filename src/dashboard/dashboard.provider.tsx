import {
  useState, type ReactNode,
} from 'react';

import type {
  IDashboardProvider,
} from '../interfaces/dashboard';

import DashboardContext from './dashboard.context';

export const DashboardProvider = ({
  children,
}: { children: ReactNode }) => {
  const dashboardProviderValue = {
    isLoading: false,
    stocksData: undefined,
    cryptoData: undefined,
    refetchMarketData: () => {},
  };
  const [dashboard, setDashboard] = useState<IDashboardProvider>(dashboardProviderValue);

  const updateDashboard = (newState: IDashboardProvider = dashboardProviderValue) => {
    setDashboard((prevState: IDashboardProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <DashboardContext.Provider value={{
      ...dashboard,
      updateDashboard,
    }}
    >
      { children }
    </DashboardContext.Provider>
  );
};
