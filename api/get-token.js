export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { agent_id } = req.body;
  if (!agent_id) return res.status(400).json({ error: 'agent_id required' });

  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agent_id })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Retell API error: ' + err });
    }

    const data = await response.json();
    return res.status(200).json({ access_token: data.access_token });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
