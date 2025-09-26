import {
  useState, type ReactNode,
} from 'react';

import DashboardContext from '../context/dashboard.context';
import type {
  IDashboardProvider,
} from '../interfaces/dashboard';

export const DashboardProvider = ({
  children,
}: { children: ReactNode }) => {
  const dashboardProviderValue = {
    isLoading: false,
    stocksData: null,
    cryptoData: null,
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
