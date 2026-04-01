import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { initMixpanel } from './analytics/mixpanel';

initMixpanel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
