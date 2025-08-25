import { fetchFirstRinseRow } from "../../api/dyeingApi";
import { positions_first_rinse } from "../../utils/constants";


export async function getFirstrinseTempTimePh(scouring, selectedColour, index,  ) {

  try {
    const positionsArray = positions_first_rinse[scouring];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await fetchFirstRinseRow(selectedColour);
    if (!row) return "dbErr";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    return value ??'dbErr'
    
  } catch (err) {
    console.error("Failed to fetch FirstrinseTempTimePh:", err);
    return "dbErr";
  }
}
