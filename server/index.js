/**
 * server/index.js
 * Unified BlueSky Store Locator API Server
 * Combines authentication, mall management, and mock store endpoints
 */

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "demo-secret-key"; // for demo use only
const PORT = process.env.PORT || 5000;

// Mock users for authentication
const users = [
  { username: "admin", password: "a", role: "admin" },
  { username: "manager", password: "m", role: "manager" },
  { username: "store", password: "s", role: "store" }
];

// Load mall data
const DATA_PATH = "./data/malls.json";
let malls = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

// Generate flattened stores data for mock endpoints
let stores = malls.flatMap((mall) => 
  mall.stores.map((store) => ({
    ...store,
    mallId: mall.id,
    mallName: mall.name,
    latitude: mall.latitude + (Math.random() - 0.5) * 0.01, // Slight offset from mall
    longitude: mall.longitude + (Math.random() - 0.5) * 0.01,
    description: store.description || `${store.type} store in ${mall.name}`,
    website: `https://${store.name.toLowerCase().replace(/\s+/g, '')}.com`
  }))
);

// Track forced failure for testing
let forcedFailure = false;

// Utility: Random delay for mock endpoints
function randomDelay(min = 400, max = 1500) {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
}

// Middleware: JWT Authentication with role-based access
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing token" });
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient privileges" });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

// ===== AUTHENTICATION ENDPOINTS =====

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role }, 
    SECRET_KEY, 
    { expiresIn: "2h" }
  );
  
  res.json({ token, role: user.role, username: user.username });
});

// ===== MALL MANAGEMENT ENDPOINTS =====

// Public: Get all malls and stores (read-only for map display)
app.get("/api/malls/public", (req, res) => {
  res.json(malls);
});

// Get all malls and stores (requires authentication)
app.get("/api/malls", auth(), (req, res) => {
  res.json(malls);
});

// Admin: Toggle entire mall open/close (affects all stores)
app.patch("/api/malls/:id/toggle", auth(["admin"]), (req, res) => {
  const mall = malls.find(m => m.id == req.params.id);
  if (!mall) {
    return res.status(404).json({ message: "Mall not found" });
  }

  mall.isOpen = !mall.isOpen;
  // Cascade to all stores in the mall
  mall.stores.forEach(store => {
    store.isOpen = mall.isOpen;
  });

  // Save changes
  fs.writeFileSync(DATA_PATH, JSON.stringify(malls, null, 2));
  
  // Update flattened stores array
  stores = stores.map(store => 
    store.mallId === mall.id ? { ...store, isOpen: mall.isOpen } : store
  );

  res.json({ 
    message: "Mall status updated successfully", 
    mall: { id: mall.id, name: mall.name, isOpen: mall.isOpen }
  });
});

// Manager: Toggle individual store open/close
app.patch("/api/malls/:mallId/stores/:storeId/toggle", auth(["manager"]), (req, res) => {
  const mall = malls.find(m => m.id == req.params.mallId);
  if (!mall) {
    return res.status(404).json({ message: "Mall not found" });
  }

  const store = mall.stores.find(s => s.id == req.params.storeId);
  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }

  // Cannot open store if mall is closed
  if (!mall.isOpen && !store.isOpen) {
    return res.status(400).json({ message: "Cannot open store: parent mall is closed" });
  }

  store.isOpen = !store.isOpen;
  
  // Save changes
  fs.writeFileSync(DATA_PATH, JSON.stringify(malls, null, 2));
  
  // Update flattened stores array
  stores = stores.map(s => 
    s.id === store.id ? { ...s, isOpen: store.isOpen } : s
  );

  res.json({ 
    message: "Store status updated successfully", 
    store: { id: store.id, name: store.name, isOpen: store.isOpen, mallId: mall.id }
  });
});

// Store User: Update store details
app.put("/api/malls/:mallId/stores/:storeId", auth(["store"]), (req, res) => {
  const mall = malls.find(m => m.id == req.params.mallId);
  if (!mall) {
    return res.status(404).json({ message: "Mall not found" });
  }

  const store = mall.stores.find(s => s.id == req.params.storeId);
  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }

  // Update allowed fields only (cannot change id, mallId, isOpen, coordinates)
  const allowedFields = ['name', 'description', 'opening_hours', 'type', 'contact'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  Object.assign(store, updates);
  
  // Save changes
  fs.writeFileSync(DATA_PATH, JSON.stringify(malls, null, 2));
  
  // Update flattened stores array
  stores = stores.map(s => 
    s.id === store.id ? { ...s, ...updates } : s
  );

  res.json({ 
    message: "Store updated successfully", 
    store: { ...store, mallId: mall.id }
  });
});

// ===== MOCK TESTING ENDPOINTS =====

// Get flattened stores list (for testing purposes)
app.get("/api/stores", async (req, res) => {
  await randomDelay();
  res.json(stores);
});

// Mock store update with simulated failures
app.patch("/api/stores/:id", async (req, res) => {
  await randomDelay();

  const id = parseInt(req.params.id);
  const index = stores.findIndex((s) => s.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Store not found" });
  }

  // Simulate one forced failure for testing error handling
  if (id === 3 && !forcedFailure) {
    forcedFailure = true;
    return res.status(500).json({ error: "Simulated backend error" });
  }

  stores[index] = { ...stores[index], ...req.body };
  res.json(stores[index]);
});

// ===== SERVER STATUS & HEALTH CHECK =====

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/login",
      malls: "/api/malls",
      stores: "/api/stores",
      health: "/api/health"
    }
  });
});

// ===== STATIC FILE SERVING =====

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BlueSky Store Locator API running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
  console.log(`🏬 Loaded ${malls.length} malls with ${stores.length} total stores`);
  console.log(`🔐 Authentication required for /api/malls endpoint`);
});