
import { fetchScouringRow } from "../../api/dyeingApi";
import { Colour_Chart, positions_scouring } from "../../utils/constants";

export async function getScouringChemGPL(scouring, selectedColour, position) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return ""; 
  const positionsArray = positions_scouring[scouring];
  if (!positionsArray) return ""; 

  
  const colNum = positionsArray.indexOf(position) + 1;
  if (!colNum) return ""; 

  try {
    
    const row = await fetchScouringRow(selectedColour);
    if (!row) return "dbErr"; 

    
    const rowValues = Object.values(row);
    const amount = rowValues[colNum] ?? "dbErr";

    return amount;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "dbErr"; 
  }
}


export async function getScouringTemperature(scouring, selectedColour) {
  if (scouring === "CreamStripe" || scouring === "Chlorine") {
    return "40˚C";
  }

  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return "";

  const positionsArray = positions_scouring[scouring];
  if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(20) + 1;
  if (!colNum) return "";

  try {
    const row = await fetchScouringRow(selectedColour);
    if (!row) return "dbErr";

    const rowValues = Object.values(row);
    let temp = rowValues[colNum] ?? "dbErr";

    // Replace "?" with a the degree symbol
    if (typeof temp === "string") {
      temp = temp.replace("?", "˚"); // use "°"
    }

    return temp;
  } catch (err) {
    console.error("Failed to fetch scouring temp:", err);
    return "dbErr";
  }
}



export async function getScouringTimeorPH(scouring, selectedColour, position) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return ""; 

  const positionsArray = positions_scouring[scouring];
  if (!positionsArray) return ""; 

  const colNum = positionsArray.indexOf(position) + 1;
  if (!colNum) return ""; 

  try {
    
    const row = await fetchScouringRow(selectedColour);
    if (!row) return "dbErr"; 

    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";

    return value;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "dbErr"; 
  }
}

export async function getHotwashGPL(dyeingSystem, selectedColour, position) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return ""; 

  const positionsArray = positions_scouring[dyeingSystem];
  if (!positionsArray) return ""; 

  const colNum = positionsArray.indexOf(position) + 1;
  if (!colNum) return ""; 

  try {
    
    const row = await fetchScouringRow(selectedColour);
    if (!row) return "dbErr"; 

    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";

    return value;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "dbErr"; 
  }
}

