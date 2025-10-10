/**
 * Malls endpoint - Vercel serverless function
 */
import { authenticateToken } from './_utils/auth.js';
import { loadMalls } from './_utils/data.js';

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

  // Authenticate user
  const authResult = authenticateToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  try {
    const malls = loadMalls();
    res.json(malls);
  } catch (error) {
    console.error('Error loading malls:', error);
    res.status(500).json({ error: 'Failed to load malls data' });
  }
}