/**
 * api/mockServer.js
 * Lightweight Express server to mock store API behavior
 */

import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { join } from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Load stores from malls data and flatten them
const mallsData = JSON.parse(readFileSync(join(process.cwd(), "../src/data/malls.json"), "utf-8"));
let stores = mallsData.flatMap((mall) => 
  mall.stores.map((store) => ({
    ...store,
    latitude: mall.latitude + (Math.random() - 0.5) * 0.01, // Slight offset from mall
    longitude: mall.longitude + (Math.random() - 0.5) * 0.01,
    description: `${store.type} store in ${mall.name}`,
    website: `https://${store.name.toLowerCase().replace(/\s+/g, '')}.com`
  }))
);

// Track if store id=3 has failed once
let forcedFailure = false;

function randomDelay(min = 400, max = 1500) {
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

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`🛰️ Mock API running at http://localhost:${port}`));