import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "demo-secret-key"; // for mock use only

// Mock users
const users = [
  { username: "admin", password: "a", role: "admin" },
  { username: "manager", password: "m", role: "manager" },
  { username: "store", password: "s", role: "store" }
];

// 🔹 Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "2h" });
  res.json({ token, role: user.role });
});

// Middleware for role-based auth
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing token" });
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (!requiredRoles.includes(decoded.role))
        return res.status(403).json({ message: "Forbidden: insufficient privileges" });
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

// Load mall data
const DATA_PATH = "./server/data/malls.json";
let malls = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

// 🔹 Get all malls (any logged in user)
app.get("/api/malls", auth(["admin", "manager", "store"]), (req, res) => {
  res.json(malls);
});

// 🔹 Admin: toggle entire mall open/close
app.patch("/api/malls/:id/toggle", auth(["admin"]), (req, res) => {
  const mall = malls.find(m => m.id == req.params.id);
  if (!mall) return res.status(404).json({ message: "Mall not found" });
  mall.isOpen = !mall.isOpen;
  mall.stores.forEach(s => (s.isOpen = mall.isOpen));
  fs.writeFileSync(DATA_PATH, JSON.stringify(malls, null, 2));
  res.json(mall);
});

// 🔹 Manager: toggle individual store open/close
app.patch("/api/malls/:mallId/stores/:storeId/toggle", auth(["manager"]), (req, res) => {
  const mall = malls.find(m => m.id == req.params.mallId);
  if (!mall) return res.status(404).json({ message: "Mall not found" });
  const store = mall.stores.find(s => s.id == req.params.storeId);
  if (!store) return res.status(404).json({ message: "Store not found" });
  store.isOpen = !store.isOpen;
  fs.writeFileSync(DATA_PATH, JSON.stringify(malls, null, 2));
  res.json(store);
});

// 🔹 Store user: update store details
app.put("/api/malls/:mallId/stores/:storeId", auth(["store"]), (req, res) => {
  const mall = malls.find(m => m.id == req.params.mallId);
  if (!mall) return res.status(404).json({ message: "Mall not found" });
  const store = mall.stores.find(s => s.id == req.params.storeId);
  if (!store) return res.status(404).json({ message: "Store not found" });

  Object.assign(store, req.body);
  fs.writeFileSync(DATA_PATH, JSON.stringify(malls, null, 2));
  res.json(store);
});

app.listen(5000, () => console.log("Auth + Store API running on http://localhost:5000"));
