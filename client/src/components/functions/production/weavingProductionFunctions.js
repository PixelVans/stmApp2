import { fetchwarpingdataRow, fetchweavingProductionRows } from "../../../api/dyeingApi";

export async function getMachineWeavingData(selectedWeek,) {
  
  if (!selectedWeek) return ""; 
try {
    
    const row = await fetchweavingProductionRows(selectedWeek);
    
    if (!row) return "dbErr"; 

    return row;
  } catch (err) {
    console.error("Failed to fetch weaving production row:", err);
    return "dbErr"; 
  }
}




export async function getMachineKnottingCountCount(beamnumber) {
  
  if (!beamnumber) return ""; 

  try {
    const row = await fetchwarpingdataRow(beamnumber);

  if (!row || row.length === 0) return ""; 
  
    // Extract KnottingCounter field
    return row[0].KnottingCounter;

  } catch (err) {
    console.error("Failed to fetch weaving production row:", err);
    return "-"; 
  }
}




