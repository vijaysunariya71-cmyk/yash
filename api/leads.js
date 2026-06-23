import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { accessKey } = req.query;

  // Uses a secure environment variable config you'll set inside Vercel
  if (!accessKey || accessKey !== process.env.DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized Access Key' });
  }

  try {
    // Fetch all items stored in the 'dubai_leads' array
    const leads = await kv.lrange('dubai_leads', 0, -1);
    return res.status(200).json(leads);
  } catch (error) {
    return res.status(500).json({ error: 'Database fetching failed' });
  }
}