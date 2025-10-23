
import type { ICryptoData } from './market-crypto';
import type { IStocksData } from './market-stocks';

export type IDashboardContext = IDashboardProvider & {
    updateDashboard: (newState: IDashboardProvider) => void;
};

export interface IDashboardProvider {
    isLoading?: boolean;
    isDemo?: boolean;
    stocksData?: IStocksData
    cryptoData?: ICryptoData
    activeTab?: number;
    refetchMarketData?: ()=>void
}
