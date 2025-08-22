// src/api/scouringApi.js
export async function fetchScouringRow(colour) {
  const res = await fetch(`http://localhost:3000/api/scouring/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch scouring row");
  return res.json(); 
}

export async function fetchHotwashRow(colour) {
  const res = await fetch(`http://localhost:3000/api/hotwash/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch hotwash row");
  return res.json(); 
}

export async function fetchPrepareToDyeRow(colour) {
  const res = await fetch(`http://localhost:3000/api/prepare-to-dye/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch prepare-to-dye row");
  return res.json(); 
}

export async function fetchDyeingRow(colour) {
  const res = await fetch(`http://localhost:3000/api/dyeing/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch dyeing row");
  return res.json(); 
}
