// src/utils/dyeingCache.js
import { fetchDyeingRow, fetchScouringRow, fetchPrepareToDyeRow } from "@/api/dyeingApi";

// In-memory cache for different dyeing tables
const cache = {
  scouring: new Map(),
  prepare: new Map(),
  dyeing: new Map(),
};

/** Clear all caches */
export function clearAllDyeingCache() {
  cache.scouring.clear();
  cache.prepare.clear();
  cache.dyeing.clear();
}

// ---------------- SC0URING ----------------
export async function getScouringRowCached(selectedColour) {
  if (cache.scouring.has(selectedColour)) {
    return cache.scouring.get(selectedColour);
  }
  const row = await fetchScouringRow(selectedColour);
  cache.scouring.set(selectedColour, row);
  return row;
}

// ------------- PREPARE-TO-DYE -------------
export async function getPrepareRowCached(selectedColour) {
  if (cache.prepare.has(selectedColour)) {
    return cache.prepare.get(selectedColour);
  }
  const row = await fetchPrepareToDyeRow(selectedColour);
  cache.prepare.set(selectedColour, row);
  return row;
}

// ---------------- DYEING ------------------
export async function getDyeingRowCached(selectedColour) {
  if (cache.dyeing.has(selectedColour)) {
    return cache.dyeing.get(selectedColour);
  }
  const row = await fetchDyeingRow(selectedColour);
  cache.dyeing.set(selectedColour, row);
  return row;
}
