import mixpanel from 'mixpanel-browser';

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;

export const initMixpanel = () => {
  if (!TOKEN) return;
  mixpanel.init(TOKEN, {
    track_pageview: false,
    record_sessions_percent: 100,
    api_host: 'https://api-eu.mixpanel.com',
  });
};

export const trackPageView = (path: string) => {
  if (!TOKEN) return;
  mixpanel.track('page_view', { path });
};

export const trackTabClick = (label: string, path: string) => {
  if (!TOKEN) return;
  mixpanel.track('tab_click', {
    tab: label,
    path,
  });
};
