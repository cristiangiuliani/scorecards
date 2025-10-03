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
  activeTab: 1,
  refetchMarketData: () => {},
  updateDashboard: () => {},
});

export default DashboardContext;
