import type {
  TCryptoData, TStocksData,
} from '../types/data.type';

export type IDashboardContext = IDashboardProvider & {
    updateDashboard: (newState: IDashboardProvider) => void;
};

export interface IDashboardProvider {
    isLoading?: boolean;
    stocksData?: TStocksData | null;
    cryptoData?: TCryptoData | null;
    refetchMarketData?: () => void;

    activeTab?: number;
}
