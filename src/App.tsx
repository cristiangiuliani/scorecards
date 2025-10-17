import { BrowserRouter } from 'react-router-dom';

import { AppRoute } from './app.route';
import { ErrorProvider } from './error-handler/error.provider';

const App = () => {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AppRoute />
      </ErrorProvider>
    </BrowserRouter>
  );
};
export default App;
