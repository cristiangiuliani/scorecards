import { createProxyHandler } from './utils/apiProxy';

export const handler = createProxyHandler(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return `https://production.dataviz.cnn.io/index/fearandgreed/graphdata/${dateStr}`;
});
