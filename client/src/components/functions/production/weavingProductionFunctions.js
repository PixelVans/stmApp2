import { fetchweavingProductionRows } from "../../../api/dyeingApi";

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





