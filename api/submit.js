import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leadData = req.body;
    
    // Push the raw entry onto a database list called 'dubai_leads'
    await kv.lpush('dubai_leads', JSON.stringify(leadData));
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Database saving failed' });
  }
}