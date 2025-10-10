/**
 * Stores endpoint (mock data) - Vercel serverless function
 */
const { authenticateToken } = require('./_utils/auth.js');
const { loadMalls, generateStores } = require('./_utils/data.js');

module.exports = function handler(req, res) {
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

  // Authenticate user
  const authResult = authenticateToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  try {
    const malls = loadMalls();
    const stores = generateStores(malls);
    
    // Add some delay for realism
    setTimeout(() => {
      res.json(stores);
    }, Math.random() * 1000 + 400);
  } catch (error) {
    console.error('Error loading stores:', error);
    res.status(500).json({ error: 'Failed to load stores data' });
  }
};