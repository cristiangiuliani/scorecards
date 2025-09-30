import cors from 'cors';
import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import fetch from 'node-fetch';

const YAHOO_FINANCE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const ALPHA_VANTAGE_KEY = 'A7NSCWJERBK5VUXC';
const REGION = 'europe-west1';
const corsHandler = cors({ origin: true });

const fetchHandler =  (req:any, res:any, url:string) => {
  corsHandler(req, res, async () => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      logger.error(`Error fetching ${url}:`, error);
      res.status(500).json({ error: `Failed to fetch ${url} data` });
    }
  });
};

export const fetchVIX = onRequest({ region: REGION }, (req:any, res:any) => {
  fetchHandler(req, res, `${YAHOO_FINANCE_URL}%5EVIX`);
});
export const fetchRSI = onRequest({ region: REGION }, (req:any, res:any) => {
  fetchHandler(req, res, `https://www.alphavantage.co/query?function=RSI&symbol=SPY&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_VANTAGE_KEY}`);
});

export const fetchUSD = onRequest({ region: REGION }, (req:any, res:any) => {
  fetchHandler(req, res, `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${ALPHA_VANTAGE_KEY}`);
});

export const fetchFearGreed = onRequest({ region: REGION }, (req:any, res:any) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // mesi 0-based
  const day = String(today.getDate()).padStart(2, '0');
  fetchHandler(req, res, `https://production.dataviz.cnn.io/index/fearandgreed/graphdata/${year}-${month}-${day}`);
});
