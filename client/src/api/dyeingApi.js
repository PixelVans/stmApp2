// src/api/scouringApi.js
export async function fetchScouringRow(colour) {
  const res = await fetch(`http://localhost:3000/api/scouring/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch scouring row");
  return res.json(); 
}
