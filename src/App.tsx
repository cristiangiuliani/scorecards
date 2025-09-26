import { BrowserRouter } from 'react-router-dom';

import { AppRoute } from './app.route';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
};
export default App;
