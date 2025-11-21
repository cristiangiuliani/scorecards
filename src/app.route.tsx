import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Dashboard from './dashboard/dashboard';
import FedPolicy from './fed-policy/fed-policy';
import MarketBubble from './market-bubble/market-bubble';
import MarketCapitalFlows from './market-capital-flows/market-capital-flows';
import MarketCrypto from './market-crypto/market-crypto';
import MarketStocks from './market-stocks/market-stocks';
import MarketTreasuryBonds from './market-treasury-bonds/market-treasury-bonds';

const NoMatchPage = () => <div>404 - Page Not Found</div>;

export const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Navigate to="/stocks-bullish-bearish-indicator" replace />} />
        <Route path="/stocks-bullish-bearish-indicator" element={<MarketStocks />} />
        <Route path="/crypto-bullish-bearish-indicator" element={<MarketCrypto />} />
        <Route path="/treasury-bonds-buy-sell-indicator" element={<MarketTreasuryBonds />} />
        <Route path="/ai-bubble-risk-indicator" element={<MarketBubble />} />
        <Route path="/capital-inflow-outflow-indicator" element={<MarketCapitalFlows />} />
        <Route path="/fed-dovish-hawkish-indicator" element={<FedPolicy />} />
      </Route>
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
  );
};
