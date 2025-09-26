import {
  createContext,
} from 'react';

import type {
  IDashboardContext,
} from '../interfaces/dashboard';

const DashboardContext = createContext<IDashboardContext>({
  isLoading: false,
  stocksData: null,
  cryptoData: null,
  activeTab: 0,
  refetchMarketData: () => {},
  updateDashboard: () => {},
});

export default DashboardContext;
