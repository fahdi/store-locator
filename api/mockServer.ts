/**
 * api/mockServer.ts
 * Lightweight Express server to mock store API behavior
 */

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

interface Store {
  id: number;
  name: string;
  type: string;
  description?: string;
  opening_hours?: string;
  latitude: number;
  longitude: number;
  website?: string;
  picture?: string;
}

let stores: Store[] = require("../src/data/stores.json");

// Track if store id=3 has failed once
let forcedFailure = false;

function randomDelay(min = 400, max = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
}

app.get("/api/stores", async (_req, res) => {
  await randomDelay();
  res.json(stores);
});

app.patch("/api/stores/:id", async (req, res) => {
  await randomDelay();

  const id = parseInt(req.params.id);
  const index = stores.findIndex((s) => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Store not found" });

  // Simulate one forced failure for id=3
  if (id === 3 && !forcedFailure) {
    forcedFailure = true;
    return res.status(500).json({ error: "Simulated backend error" });
  }

  stores[index] = { ...stores[index], ...req.body };
  res.json(stores[index]);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🛰️ Mock API running at http://localhost:${port}`));
