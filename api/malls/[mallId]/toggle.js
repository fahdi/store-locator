/**
 * Toggle mall status - Vercel serverless function
 */
const { authenticateToken, checkRole } = require('../../_utils/auth.js');
const { loadMalls, saveMalls } = require('../../_utils/data.js');

module.exports = function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate user
  const authResult = authenticateToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  // Check admin role
  const roleResult = checkRole(authResult.user, ['admin']);
  if (roleResult) {
    return res.status(roleResult.status).json({ error: roleResult.error });
  }

  const { mallId } = req.query;
  const mallIdNum = parseInt(mallId);

  if (!mallIdNum) {
    return res.status(400).json({ error: 'Invalid mall ID' });
  }

  try {
    const malls = loadMalls();
    const mall = malls.find(m => m.id === mallIdNum);

    if (!mall) {
      return res.status(404).json({ error: 'Mall not found' });
    }

    // Toggle mall status
    mall.isOpen = !mall.isOpen;

    // If closing mall, close all stores too
    if (!mall.isOpen) {
      mall.stores.forEach(store => {
        store.isOpen = false;
      });
    }

    // Save changes
    if (!saveMalls(malls)) {
      return res.status(500).json({ error: 'Failed to save changes' });
    }

    res.json({
      message: `Mall ${mall.isOpen ? 'opened' : 'closed'} successfully`,
      mall: {
        id: mall.id,
        name: mall.name,
        isOpen: mall.isOpen
      }
    });
  } catch (error) {
    console.error('Error toggling mall:', error);
    res.status(500).json({ error: 'Failed to toggle mall status' });
  }
};