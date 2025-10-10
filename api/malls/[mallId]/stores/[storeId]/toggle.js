/**
 * Toggle store status - Vercel serverless function
 */
import { authenticateToken, checkRole } from '../../../../_utils/auth.js';
import { loadMalls, saveMalls } from '../../../../_utils/data.js';

export default function handler(req, res) {
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

  // Check manager role
  const roleResult = checkRole(authResult.user, ['manager']);
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

    // Check if trying to open store when mall is closed
    if (!store.isOpen && !mall.isOpen) {
      return res.status(400).json({ 
        error: 'Cannot open store when mall is closed. Please open the mall first.' 
      });
    }

    // Toggle store status
    store.isOpen = !store.isOpen;

    // Save changes
    if (!saveMalls(malls)) {
      return res.status(500).json({ error: 'Failed to save changes' });
    }

    res.json({
      message: `Store ${store.isOpen ? 'opened' : 'closed'} successfully`,
      store: {
        id: store.id,
        name: store.name,
        isOpen: store.isOpen,
        mallId: mall.id
      }
    });
  } catch (error) {
    console.error('Error toggling store:', error);
    res.status(500).json({ error: 'Failed to toggle store status' });
  }
}