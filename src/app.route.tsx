import { Route, Routes } from 'react-router-dom';

const Scorecards = () => <div>Scorecards Page</div>;
const NoMatchPage = () => <div>404 - Page Not Found</div>;

// import ErrorBoundary from './errorBoundary'

export const AppRoute = () => {
  return (
    // <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Scorecards />} />
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
    // </ErrorBoundary>
  );
};
