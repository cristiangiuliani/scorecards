import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // mesi 0-based
    const day = String(today.getDate()).padStart(2, '0');

    const dateStr = `${year}-${month}-${day}`;

    const url = `https://production.dataviz.cnn.io/index/fearandgreed/graphdata/${dateStr}`;

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
