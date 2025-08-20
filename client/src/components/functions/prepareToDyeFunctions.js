import { positions_prepare_to_dye } from "../../utils/constants";
import { fetchPrepareToDyeRow } from "../../api/dyeingApi";

export async function getPrepareToDyeChem1GPL(selectedColour, dyeingSystem, ) {

  if (dyeingSystem !== "VAT") return "";
 const colNum = 3;
   
  try {
    const row = await fetchPrepareToDyeRow(selectedColour);
    if (!row) return "dbErr"; 

    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";

    // If blank or null, return ""
    if (value === null || value === undefined || value === "") {
      return "";
    }
    
    return value;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "dbErr"; 
  }
}







export async function getPrepareToDyeChem2GPL(selectedColour, dyeingSystem, scouring) {
  
try {
    const row = await fetchPrepareToDyeRow(selectedColour);
    if (!row) return "dbErr"; 

    let value;
    let I21 = null
    // VAT logic
    if (dyeingSystem === "VAT") {
      value = row.Dyestuff_2_Amt ?? "";
      return value === "" ? "" : value;
    }

    // Non-VAT logic
    const positionsArray = positions_prepare_to_dye[scouring];
    if (!positionsArray) return "";

    let colNum;
    if (I21 == null) {  
      colNum = positionsArray.indexOf(3) + 1;
    } else {
      colNum = positionsArray.indexOf(6) + 1;
    }
     
    const rowValues = Object.values(row);
    value = rowValues[colNum] ?? "dbErr";
    return (value === null || value === undefined || value === "") ? "" : value;
    
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "dbErr"; 
  }
}








export async function getPrepareToDyeChem3GPL(selectedColour, dyeingSystem, scouring) {
  try {
    const row = await fetchPrepareToDyeRow(selectedColour);
    if (!row) return "dbErr"; 

    let value;
     if (dyeingSystem === "VAT") {
      value = row.Dyestuff_3_Amt ?? "";
      return value === "" ? "" : value;
    }

    const positionsArray = positions_prepare_to_dye[scouring];
    if (!positionsArray) return "";

    const  colNum = positionsArray.indexOf(2) + 1;
    const rowValues = Object.values(row);
    value = rowValues[colNum] ?? "dbErr";
   return (value === null || value === undefined || value === "") ? "" : value;
    
  } catch (err) {
    console.error("Failed to fetch prepare to dye chem 3 GramsPL:", err);
    return "dbErr"; 
  }
}






export async function getPrepareToDyeTemperature(selectedColour, dyeingSystem, scouring) {

  if (scouring === "CreamStripe") return "40˚C";
  const positionsArray = positions_prepare_to_dye[dyeingSystem];
    if (!positionsArray) return "";

    const colNum = positionsArray.indexOf(20) + 1;
    if (colNum === -1) return "";
    try {
    const row = await fetchPrepareToDyeRow(selectedColour);
    if (!row) return "dbErr"; 

    let value;
    const rowValues = Object.values(row);
    value = rowValues[colNum] ?? "dbErr";
   
    return (value === null || value === undefined || value === "") ? "" : value;
    
  } catch (err) {
    console.error("Failed to fetch prepare to dye Temp:", err);
    return "dbErr"; 
  }
}






export async function getPrepareToDyePhorTime(selectedColour, dyeingSystem, code) {
  
const positionsArray = positions_prepare_to_dye[dyeingSystem];
    if (!positionsArray) return "";
const  colNum = positionsArray.indexOf(code) + 1;

  try {
    const row = await fetchPrepareToDyeRow(selectedColour);
    if (!row) return "dbErr"; 

    let value;

    
    const rowValues = Object.values(row);
    value = rowValues[colNum] ?? "dbErr";
   
    return (value === null || value === undefined || value === "") ? "" : value;
    
  } catch (err) {
    console.error("Failed to fetch prepare to dye Ph or Time:", err);
    return "dbErr"; 
  }
}






