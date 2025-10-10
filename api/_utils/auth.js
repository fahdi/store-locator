/**
 * Authentication utilities for Vercel serverless functions
 */
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "demo-secret-key";

// Mock users for authentication
export const users = [
  { username: "admin", password: "a", role: "admin" },
  { username: "manager", password: "m", role: "manager" },
  { username: "store", password: "s", role: "store" }
];

export function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { error: 'Access token required', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { user: decoded };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 403 };
  }
}

export function checkRole(user, allowedRoles) {
  if (!allowedRoles.includes(user.role)) {
    return { error: `Access denied. Required role: ${allowedRoles.join(' or ')}`, status: 403 };
  }
  return null;
}

export function generateToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '2h' }
  );
}