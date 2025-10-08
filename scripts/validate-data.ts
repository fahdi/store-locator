/**
 * scripts/validate-data.ts
 * Validate store dataset for missing fields, bad coordinates, or duplicates.
 */

import fs from "fs";
import path from "path";

const dataPath = path.resolve(__dirname, "../src/data/stores.json");

type Store = {
  id: number;
  zoneId?: number;
  name?: string;
  type?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
};

function validateStore(store: Store, index: number, seenIds: Set<number>): string[] {
  const errors: string[] = [];

  // ID checks
  if (store.id == null) errors.push("Missing id");
  else if (seenIds.has(store.id)) errors.push("Duplicate id");
  else seenIds.add(store.id);

  // Required fields
  ["name", "type", "latitude", "longitude"].forEach((field) => {
    if (!store[field]) errors.push(`Missing ${field}`);
  });

  // Coordinate validation
  if (store.latitude && (store.latitude < 24.5 || store.latitude > 26.0))
    errors.push(`Latitude out of Qatar range (${store.latitude})`);
  if (store.longitude && (store.longitude < 50.5 || store.longitude > 52.0))
    errors.push(`Longitude out of Qatar range (${store.longitude})`);

  // Swapped lat/lng detection
  if (store.latitude && store.longitude && store.latitude < store.longitude / 10)
    errors.push("Possible swapped lat/lng");

  return errors.length
    ? errors.map((e) => `Record #${index + 1} (${store.name ?? "unknown"}): ${e}`)
    : [];
}

function main() {
  if (!fs.existsSync(dataPath)) {
    console.error("❌ Could not find stores.json at", dataPath);
    process.exit(1);
  }

  const stores: Store[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const seenIds = new Set<number>();
  const allErrors: string[] = [];

  stores.forEach((store, i) => {
    allErrors.push(...validateStore(store, i, seenIds));
  });

  if (allErrors.length === 0) {
    console.log("✅ All store data looks valid.");
  } else {
    console.error(`⚠️ Found ${allErrors.length} issues:\n`);
    allErrors.forEach((err) => console.error(" - " + err));
    process.exitCode = 1;
  }
}

main();
