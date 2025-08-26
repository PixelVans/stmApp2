import { fetchSoapingRow } from "../../api/dyeingApi";
import { positions_soaping } from "../../utils/constants";

export async function getSoapingChemGPL(dyeingSystem, selectedColour, position) {
   
  const positionsArray = positions_soaping[dyeingSystem];
  if (!positionsArray) return ""; 

  
  const colNum = positionsArray.indexOf(position) + 1;
  if (!colNum) return ""; 

  try {
    const row = await fetchSoapingRow(selectedColour);
    if (!row) return "dbErr"; 
    const rowValues = Object.values(row);
    const amount = rowValues[colNum] ?? "dbErr";

    return amount;
  } catch (err) {
    console.error("Failed to fetch soaping GramsPL:", err);
    return "dbErr"; 
  }
}



export async function getSoapingTemp(scouring, selectedColour, index, dyeingSystem ) {

  try {
    if (scouring === "CreamStripe") return "60˚C";

  const positionsArray = positions_soaping[dyeingSystem];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await fetchSoapingRow(selectedColour);
    if (!row) return "dbErr";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    return value ??'dbErr'
    
  } catch (err) {
    console.error("Failed to Soaping Temp:", err);
    return "dbErr";
  }
}





export async function getSoapingTimePh(selectedColour, index, dyeingSystem ) {

  try {
    const positionsArray = positions_soaping[dyeingSystem];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await fetchSoapingRow(selectedColour);
    if (!row) return "dbErr";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    return value ??'dbErr'
    
  } catch (err) {
    console.error("Failed to fetch Soaping amount:", err);
    return "dbErr";
  }
}

