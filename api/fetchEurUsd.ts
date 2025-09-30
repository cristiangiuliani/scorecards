import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const ALPHA_VANTAGE_KEY = 'A7NSCWJERBK5VUXC';
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${ALPHA_VANTAGE_KEY}`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
