import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 1. Drop any requests that aren't POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;

    // 2. Validate that data actually arrived
    if (!data || !data.phone) {
      return res.status(400).json({ error: 'Missing form data values' });
    }

    // 3. Generate a clean key using a timestamp
    const leadId = `lead:${Date.now()}`;

    // 4. Save the lead payload into Vercel KV
    await kv.set(leadId, data);

    // 5. Push the lead ID into a list so your dashboard can read it later
    await kv.lpush('all_leads', leadId);

    // 6. Return success to the frontend
    return res.status(200).json({ success: true });

  } catch (dbError) {
    // DIAGNOSTIC TRICK: Print the exact system error message back to the alert box
    console.error("Vercel KV Error Logged:", dbError);
    return res.status(500).json({ 
      error: `Database connection failed: ${dbError.message}. Make sure your KV store is linked in the Vercel Storage tab.` 
    });
  }
}