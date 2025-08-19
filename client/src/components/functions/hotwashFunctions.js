import { Colour_Chart, positions_hotwash } from "../../utils/constants";
import { fetchHotwashRow } from "../../api/dyeingApi";

export async function getHotwashTempTimeorPH(selectedColour, dyeingSystem, position) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return ""; 

  const positionsArray = positions_hotwash[dyeingSystem];
  if (!positionsArray) return ""; 

  const colNum = positionsArray.indexOf(position) + 1;
  if (!colNum) return ""; 

  try {
    
    const row = await fetchHotwashRow(selectedColour);
    if (!row) return "dbErr"; 

    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "dbErr";
    
    return value;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "dbErr"; 
  }
}

