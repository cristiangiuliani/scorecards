import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initMixpanel } from './analytics/mixpanel';
import App from './App';

initMixpanel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
