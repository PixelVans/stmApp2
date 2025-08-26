import { fetchFinishingRow,  } from "../../api/dyeingApi";
import { positions_finishing,  } from "../../utils/constants";

export async function getFinishingChemGPL1(scouring, selectedColour, softener,) {
    const positionsArray = positions_finishing[scouring];
    if (!positionsArray) return "";
    let colNum;

    if (softener === "Bubanks"){ 
    colNum = positionsArray.indexOf(3) + 1;
    } else{
    colNum = positionsArray.indexOf(2) + 1;
    };   
   
    if (!colNum) return ""; 
   try {
    const row = await fetchFinishingRow(selectedColour);
    if (!row) return "dbErr"; 
    const rowValues = Object.values(row);
    const amount = rowValues[colNum] ?? "dbErr";

    return amount;
  } catch (err) {
    console.error("Failed to fetch finishing GramsPL:", err);
    return "dbErr"; 
  }
}




export async function getFinishingChemGPL2(scouring, selectedColour, liqRatio8,) {
    
  const positionsArray = positions_finishing[scouring];
  if (!positionsArray) return ""; 
  let colNum;
   
  //liqRatio8 carries the dyefix selected.
   if (liqRatio8 === "Dye Fix"){ 
    colNum = positionsArray.indexOf(3) + 1;
    } else{
    return "";
    };   
  
  if (!colNum) return ""; 

  try {
    const row = await fetchFinishingRow(selectedColour);
    if (!row) return "dbErr"; 
    const rowValues = Object.values(row);
    const amount = rowValues[colNum] ?? "dbErr";

    return amount;
  } catch (err) {
    console.error("Failed to fetch finishing GramsPL:", err);
    return "dbErr"; 
  }
}



export async function getFinishingTempTimePh(selectedColour, index, scouring ) {

  try {
    const positionsArray = positions_finishing[scouring];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await fetchFinishingRow(selectedColour);
    if (!row) return "dbErr";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    return value ??'dbErr'
    
  } catch (err) {
    console.error("Failed to fetch finishing data:", err);
    return "dbErr";
  }
}


