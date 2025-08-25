import { fetchDyeingRow } from "../../api/dyeingApi";
import { positions_dyeing } from "../../utils/constants";


export async function getEndChemGPL(dyeingSystem, selectedColour, position) {
   
  const positionsArray = positions_dyeing[dyeingSystem];
  if (!positionsArray) return ""; 

  
  const colNum = positionsArray.indexOf(position) + 1;
  if (!colNum) return ""; 

  try {
    
    const row = await fetchDyeingRow(selectedColour);
    if (!row) return "dbErr"; 

    
    const rowValues = Object.values(row);
    const amount = rowValues[colNum] ?? "dbErr";

    return amount;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "dbErr"; 
  }
}



export async function getEndTemp(scouring, selectedColour, index, dyeingSystem ) {

  try {
    if (scouring === "CreamStripe") return "60˚C";

  const positionsArray = positions_dyeing[dyeingSystem];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await fetchDyeingRow(selectedColour);
    if (!row) return "dbErr";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    return value ??'dbErr'
    
  } catch (err) {
    console.error("Failed to fetch end Temp:", err);
    return "dbErr";
  }
}


export async function getEndTimePh(selectedColour, index, dyeingSystem ) {

  try {
    const positionsArray = positions_dyeing[dyeingSystem];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await fetchDyeingRow(selectedColour);
    if (!row) return "dbErr";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    return value ??'dbErr'
    
  } catch (err) {
    console.error("Failed to fetch dyestuff amount:", err);
    return "dbErr";
  }
}
