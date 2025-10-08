/**
 * server/utils/validate-data.js
 * Validate mall and store dataset for missing fields, bad coordinates, or duplicates.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, "../data/malls.json");

function validateMall(mall, index, seenIds) {
  const errors = [];

  // Mall validation
  if (mall.id == null) errors.push("Missing mall id");
  else if (seenIds.has(mall.id)) errors.push("Duplicate mall id");
  else seenIds.add(mall.id);

  ["name", "latitude", "longitude"].forEach((field) => {
    if (!mall[field]) errors.push(`Missing mall ${field}`);
  });

  // Coordinate validation for mall
  if (mall.latitude && (mall.latitude < 24.5 || mall.latitude > 26.0))
    errors.push(`Mall latitude out of Qatar range (${mall.latitude})`);
  if (mall.longitude && (mall.longitude < 50.5 || mall.longitude > 52.0))
    errors.push(`Mall longitude out of Qatar range (${mall.longitude})`);

  // Validate stores within mall
  if (mall.stores) {
    const storeIds = new Set();
    mall.stores.forEach((store, storeIndex) => {
      const storeErrors = validateStore(store, storeIndex, storeIds, mall.name);
      errors.push(...storeErrors);
    });
  }

  return errors.length
    ? errors.map((e) => `Mall #${index + 1} (${mall.name ?? "unknown"}): ${e}`)
    : [];
}

function validateStore(store, index, seenIds, mallName) {
  const errors = [];

  // ID checks
  if (store.id == null) errors.push("Missing id");
  else if (seenIds.has(store.id)) errors.push("Duplicate id");
  else seenIds.add(store.id);

  // Required fields
  ["name", "type", "opening_hours"].forEach((field) => {
    if (!store[field]) errors.push(`Missing ${field}`);
  });

  // Coordinate validation (stores inherit mall coordinates, so this is optional)
  if (store.latitude && (store.latitude < 24.5 || store.latitude > 26.0))
    errors.push(`Latitude out of Qatar range (${store.latitude})`);
  if (store.longitude && (store.longitude < 50.5 || store.longitude > 52.0))
    errors.push(`Longitude out of Qatar range (${store.longitude})`);

  // Swapped lat/lng detection
  if (store.latitude && store.longitude && store.latitude < store.longitude / 10)
    errors.push("Possible swapped lat/lng");

  return errors.length
    ? errors.map((e) => `Store #${index + 1} in ${mallName} (${store.name ?? "unknown"}): ${e}`)
    : [];
}

function main() {
  if (!fs.existsSync(dataPath)) {
    console.error("❌ Could not find malls.json at", dataPath);
    process.exit(1);
  }

  const malls = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const seenIds = new Set();
  const allErrors = [];

  malls.forEach((mall, i) => {
    allErrors.push(...validateMall(mall, i, seenIds));
  });

  if (allErrors.length === 0) {
    console.log("✅ All mall and store data looks valid.");
    console.log(`📊 Validated ${malls.length} malls with ${malls.reduce((sum, mall) => sum + (mall.stores?.length || 0), 0)} total stores`);
  } else {
    console.error(`⚠️ Found ${allErrors.length} issues:\n`);
    allErrors.forEach((err) => console.error(" - " + err));
    process.exitCode = 1;
  }
}

main();