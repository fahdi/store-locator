/**
 * Update store details - Vercel serverless function
 */
const { authenticateToken, checkRole } = require('../../../../_utils/auth.js');
const { loadMalls, saveMalls } = require('../../../../_utils/data.js');

module.exports = function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate user
  const authResult = authenticateToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  // Check store role
  const roleResult = checkRole(authResult.user, ['store']);
  if (roleResult) {
    return res.status(roleResult.status).json({ error: roleResult.error });
  }

  const { mallId, storeId } = req.query;
  const mallIdNum = parseInt(mallId);
  const storeIdNum = parseInt(storeId);

  if (!mallIdNum || !storeIdNum) {
    return res.status(400).json({ error: 'Invalid mall or store ID' });
  }

  try {
    const malls = loadMalls();
    const mall = malls.find(m => m.id === mallIdNum);

    if (!mall) {
      return res.status(404).json({ error: 'Mall not found' });
    }

    const store = mall.stores.find(s => s.id === storeIdNum);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Update store fields
    const updates = req.body;
    
    if (updates.name) store.name = updates.name;
    if (updates.description) store.description = updates.description;
    if (updates.opening_hours) store.opening_hours = updates.opening_hours;
    if (updates.phone) store.phone = updates.phone;
    if (updates.email) store.email = updates.email;
    if (updates.website) store.website = updates.website;

    // Save changes
    if (!saveMalls(malls)) {
      return res.status(500).json({ error: 'Failed to save changes' });
    }

    res.json({
      message: 'Store updated successfully',
      store: {
        ...store,
        mallId: mall.id,
        mallName: mall.name
      }
    });
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
};