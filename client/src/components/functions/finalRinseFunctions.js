import { fetchFinalRinseRow, } from "../../api/dyeingApi";
import { positions_final_rinse, positions_first_rinse } from "../../utils/constants";



export async function getFinalRinseTempTimePh(selectedColour, index, scouring ) {

  try {
    const positionsArray = positions_final_rinse[scouring];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await fetchFinalRinseRow(selectedColour);
    if (!row) return "dbErr";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    return value ??'dbErr'
    
  } catch (err) {
    console.error("Failed to fetch final Rinse data:", err);
    return "dbErr";
  }
}

