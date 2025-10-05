import {
  createContext,
} from 'react';

import type {
  IDashboardContext,
} from '../interfaces/dashboard';

const DashboardContext = createContext<IDashboardContext>({
  isLoading: false,
  stocksData: undefined,
  cryptoData: undefined,
  activeTab: undefined,
  refetchMarketData: () => {},
  updateDashboard: () => {},
});

export default DashboardContext;
