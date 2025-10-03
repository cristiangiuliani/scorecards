
import type { TCryptoData } from './market-crypto';
import type { TStocksData } from './market-stocks';

export type IDashboardContext = IDashboardProvider & {
    updateDashboard: (newState: IDashboardProvider) => void;
};

export interface IDashboardProvider {
    isLoading?: boolean;
    stocksData?: TStocksData
    cryptoData?: TCryptoData
    activeTab?: number;
    refetchMarketData?: ()=>void
}
