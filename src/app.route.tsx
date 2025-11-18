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
        <Route index element={<Navigate to="/stocks-bullish-bearish" replace />} />
        <Route path="/stocks-bullish-bearish" element={<MarketStocks />} />
        <Route path="/crypto-bullish-bearish" element={<MarketCrypto />} />
        <Route path="/treasury-bullish-bearish" element={<MarketTreasuryBonds />} />
        <Route path="/ai-bubble" element={<MarketBubble />} />
        <Route path="/capital-flow" element={<MarketCapitalFlows />} />
        <Route path="/fed-dovish-hawkish" element={<FedPolicy />} />
      </Route>
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
  );
};
