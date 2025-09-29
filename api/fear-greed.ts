import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 1); // fallback a ieri
    const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

    const url = `https://production.dataviz.cnn.io/index/fearandgreed/graphdata/${dateStr}`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
