import mixpanel from 'mixpanel-browser';

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;
const IS_PROD = import.meta.env.PROD;

export const initMixpanel = () => {
  if (!IS_PROD || !TOKEN) return;
  mixpanel.init(TOKEN, { track_pageview: false });
};

export const trackPageView = (path: string) => {
  if (!IS_PROD || !TOKEN) return;
  mixpanel.track('page_view', { path });
};

export const trackTabClick = (label: string, path: string) => {
  if (!IS_PROD || !TOKEN) return;
  mixpanel.track('tab_click', { tab: label, path });
};
