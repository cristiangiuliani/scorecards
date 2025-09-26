import { Route, Routes } from 'react-router-dom';

import Dashboard from './dashboard';

const NoMatchPage = () => <div>404 - Page Not Found</div>;

export const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
  );
};
