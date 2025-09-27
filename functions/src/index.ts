import cors from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import fetch from 'node-fetch';

const corsHandler = cors({ origin: true });

export const fetchVix = onRequest(
  { region: 'europe-west1' }, // qui imposti la regione
  (req: any, res: any) => {
    corsHandler(req, res, async () => {
      try {
        const response = await fetch(
          'https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX'
        );
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching VIX:', error);
        res.status(500).json({ error: 'Failed to fetch VIX data' });
      }
    });
  }
);
