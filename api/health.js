/**
 * Health check endpoint - Vercel serverless function
 */
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/login',
      malls: '/api/malls',
      health: '/api/health'
    },
    environment: 'vercel-serverless'
  });
}