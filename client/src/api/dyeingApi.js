
export async function fetchScouringRow(colour) {
  const res = await fetch(`/api/scouring/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch scouring row");
  return res.json();
}

export async function fetchHotwashRow(colour) {
  const res = await fetch(`/api/hotwash/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch hotwash row");
  return res.json();
}

export async function fetchPrepareToDyeRow(colour) {
  const res = await fetch(`/api/prepare-to-dye/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch prepare-to-dye row");
  return res.json();
}

export async function fetchDyeingRow(colour) {
  const res = await fetch(`/api/dyeing/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch dyeing row");
  return res.json();
}

export async function fetchFirstRinseRow(colour) {
  const res = await fetch(`/api/first-rinse/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch first-rinse row");
  return res.json();
}

export async function fetchSoapingRow(colour) {
  const res = await fetch(`/api/soaping/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch the soaping row");
  return res.json();
}

export async function fetchFinalRinseRow(colour) {
  const res = await fetch(`/api/final-rinse/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch the final-rinse row");
  return res.json();
}

export async function fetchFinishingRow(colour) {
  const res = await fetch(`/api/finishing/${encodeURIComponent(colour)}`);
  if (!res.ok) throw new Error("Failed to fetch the finishing row");
  return res.json();
}

export async function fetchChemicalsRow(chemical) {
  const res = await fetch(`/api/chemicals/${encodeURIComponent(chemical)}`);
  if (!res.ok) throw new Error("Failed to fetch the chemicals row");
  return res.json();
}

export async function fetchDyeStuffsRow(dyestuff) {
  const res = await fetch(`/api/dyestuff/${encodeURIComponent(dyestuff)}`);
  if (!res.ok) throw new Error("Failed to fetch the dyes row");
  return res.json();
}

// Fetch weaving production by week
export async function fetchweavingProductionRows(weeknumber) {
  const res = await fetch(`/api/weaving-production/week/${encodeURIComponent(weeknumber)}`);
  if (!res.ok) throw new Error("Failed to fetch the weaving-production row");
  return res.json();
}

// Fetch warping data by beam
export async function fetchwarpingdataRow(beamnumber) {
  const res = await fetch(`/api/weaving-production/beam/${encodeURIComponent(beamnumber)}`);
  if (!res.ok) throw new Error("Failed to fetch the warping data row");
  return res.json();
}




