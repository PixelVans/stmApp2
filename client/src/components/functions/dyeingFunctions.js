
// import { fetchDyeingRow, fetchPrepareToDyeRow, fetchScouringRow } from "../../api/dyeingApi";
// import { Colour_Chart, positions_dyeing, positions_prepare_to_dye, positions_scouring, Titles_Dyeing } from "../../utils/constants";

// export async function getScouringChemGPL(scouring, selectedColour, position) {
//   const colourIdx = Colour_Chart.indexOf(selectedColour);
//   if (colourIdx === -1) return ""; 
//   const positionsArray = positions_scouring[scouring];
//   if (!positionsArray) return ""; 

  
//   const colNum = positionsArray.indexOf(position) + 1;
//   if (!colNum) return ""; 

//   try {
    
//     const row = await fetchScouringRow(selectedColour);
//     if (!row) return "0"; 

    
//     const rowValues = Object.values(row);
//     const amount = rowValues[colNum] ?? "0";

//     return amount;
//   } catch (err) {
//     console.error("Failed to fetch scouring GramsPL:", err);
//     return "0"; 
//   }
// }


// export async function getScouringTemperature(scouring, selectedColour) {
//   if (scouring === "CreamStripe" || scouring === "Chlorine") {
//     return "40˚C";
//   }

//   const colourIdx = Colour_Chart.indexOf(selectedColour);
//   if (colourIdx === -1) return "";

//   const positionsArray = positions_scouring[scouring];
//   if (!positionsArray) return "";

//   const colNum = positionsArray.indexOf(20) + 1;
//   if (!colNum) return "";

//   try {
//     const row = await fetchScouringRow(selectedColour);
//     if (!row) return "0";

//     const rowValues = Object.values(row);
//     let temp = rowValues[colNum] ?? "0";

//     // Replace "?" with a the degree symbol
//     if (typeof temp === "string") {
//       temp = temp.replace("?", "˚"); 
//     }

//     return temp;
//   } catch (err) {
//     console.error("Failed to fetch scouring temp:", err);
//     return "0";
//   }
// }



// export async function getScouringTimeorPH(scouring, selectedColour, position) {
//   const colourIdx = Colour_Chart.indexOf(selectedColour);
//   if (colourIdx === -1) return ""; 

//   const positionsArray = positions_scouring[scouring];
//   if (!positionsArray) return ""; 

//   const colNum = positionsArray.indexOf(position) + 1;
//   if (!colNum) return ""; 

//   try {
    
//     const row = await fetchScouringRow(selectedColour);
//     if (!row) return "0"; 

//     const rowValues = Object.values(row);
//     const value = rowValues[colNum] ?? "0";

//     return value;
//   } catch (err) {
//     console.error("Failed to fetch scouring GramsPL:", err);
//     return "0"; 
//   }
// }

// export async function getHotwashGPL(dyeingSystem, selectedColour, position) {
//   const colourIdx = Colour_Chart.indexOf(selectedColour);
//   if (colourIdx === -1) return ""; 

//   const positionsArray = positions_scouring[dyeingSystem];
//   if (!positionsArray) return ""; 

//   const colNum = positionsArray.indexOf(position) + 1;
//   if (!colNum) return ""; 

//   try {
    
//     const row = await fetchScouringRow(selectedColour);
//     if (!row) return "0"; 

//     const rowValues = Object.values(row);
//     const value = rowValues[colNum] ?? "0";

//     return value;
//   } catch (err) {
//     console.error("Failed to fetch scouring GramsPL:", err);
//     return "0"; 
//   }
// }




// export async function getDyeingSec1ChemGpl(mode, selectedColour, scouring, b26Title) {

//  let value;
 
//   const positionsArray = positions_prepare_to_dye[scouring];
//   if (!positionsArray) return ""; 

//   const colNum = positionsArray.indexOf(4) + 1;
//   if (!colNum) return ""; 
  
//   const colIndex = Titles_Dyeing.indexOf(b26Title) + 1;
//   if (colIndex === -1) return "";

//   try {
//     let row;
//     row = await fetchPrepareToDyeRow(selectedColour);

//     if (!row) return "0"; 
//     const rowValues = Object.values(row);
//     if (mode === "prepareToDye") {

//      value = rowValues[colNum] ?? "0";
//      return value ??'0'

//   } 
//   if (mode === "dyeing") {
//     row = await fetchDyeingRow(selectedColour)
//     const dyeingrowValues = Object.values(row);
//     value = dyeingrowValues[colIndex] ?? "0";
//     return value ?? '0'
//   }
//   return value;

//   } catch (err) {
//     console.error("Failed to fetch DyeingSec1ChemGpl:", err);
//     return "0"; 
//   }
// }



// export async function getDyeingSec1ChemGpl2( selectedColour, b26Title) {
//   if(!b26Title) return "";

  

//   const colIndex = Titles_Dyeing.indexOf(b26Title) + 1;
//   if (colIndex === -1) return "";

//   try {
//     const row = await fetchDyeingRow(selectedColour)
//     const dyeingrowValues = Object.values(row);
//     const value = dyeingrowValues[colIndex] ?? "0";
//     return value ?? '0'
  
//  } catch (err) {
//     console.error("Failed to fetch DyeingSec1ChemGpl 2:", err);
//     return "0"; 
//   }
// }


// export async function getDyeingSec1ChemGpl1( selectedColour, scouring,) {

//  let value;
 
//   const positionsArray = positions_prepare_to_dye[scouring];
//   if (!positionsArray) return ""; 

//   const colNum = positionsArray.indexOf(4) + 1;
//   if (!colNum) return ""; 

//   try {
//     let row;
//     row = await fetchPrepareToDyeRow(selectedColour);
    
//     if (!row) return "0"; 
//     const rowValues = Object.values(row);
//     value = rowValues[colNum] ?? "0";
//      return value ??'0'

//    } catch (err) {
//     console.error("Failed to fetch DyeingSec1ChemGpl one 1:", err);
//     return "0"; 
//   }
// }



// export function getDyeingSec1ChemAmt1(C25, waterLitresDyeing, unit = "Kgs") {
//   try {
//     const product = C25 * waterLitresDyeing;

//     if (product >= 1000) {
//       // Divide by 1000, round to 1 decimal, append unit
//       return (Math.round((product / 1000) * 10) / 10) + " "+  unit;
//     } else {
//       // Just round to 1 decimal
//       return Math.round(product * 10) / 10 +  " "+  "gm";
//     }
//   } catch (e) {
//     return ""; 
//   }
// }


// export function getDyeingSec1ChemAmt2(C26, waterLitresDyeing, unit = "Kgs") {
//   try {
//     const product = C26 * waterLitresDyeing;

//     if (product >= 1000) {
//       // Divide by 1000, roundup to integer, append unit
//       return Math.ceil(product / 1000) + " " + unit;
//     } else {
//       // Roundup to integer grams
//       if (product <= 0) {
//         return "";
//       }
//       return Math.ceil(product) + " " + " gm";
//     }
//   } catch (e) {
//     return ""; 
//   }
// }






// export async function getDyeingSec1Value(scouring,  selectedColour,dyeingSystem, positionCode)
  
// {
//   try {
//     // Special case for CreamStripe (only if position 22/temperature)
//     if (scouring === "CreamStripe" && positionCode === 22) {
//       return "40˚C";
//     }

//     const positionsArray = positions_dyeing[dyeingSystem];
//     if (!positionsArray) return "";

//     const colNum = positionsArray.indexOf(positionCode) + 1;
//     if (!colNum) return "";

//     const row = await fetchDyeingRow(selectedColour);
//     if (!row) return "0";
   
//     const rowValues = Object.values(row);
    
//     return rowValues[colNum] ?? "0";
    

//   } catch (err) {
//     console.error("Failed to fetch Dyeing value:", err);
//     return "0";
//   }
// }




// function normalizeSaltOption(option) {
//   if (!option) return null;
//   return option
//     .replace(/[()]/g, "")   // remove brackets
//     .replace(/\s+/g, "_");  // spaces → underscores
// }

// export async function getDyestuffGpl(selectedColour, index, saltOptionstep4) {
//   try {
//     const row = await fetchDyeingRow(selectedColour);
//     if (!row) return "0";

//     // Case 1: Salt / other chemical
//     if (index === 6 && saltOptionstep4) {
//       const dbKey = normalizeSaltOption(saltOptionstep4);
//       const value = row[dbKey];
//       return value ?? "";
//     }

//     // Case 2: Dyestuff (1–4)
//     const key = `Dyestuff_${index}_Amt`;
//     const value = row[key];

//     return value ?? "";
//   } catch (err) {
//     console.error("getDyestuffGpl err:", err);
//     return "0";
//   }
// }


// export async function getDyeingSec2Temp(scouring, selectedColour, index, dyeingSystem ) {

//   try {
//     if (scouring === "CreamStripe") return "40˚C";

//   const positionsArray = positions_dyeing[dyeingSystem];
//     if (!positionsArray) return "";

//   const colNum = positionsArray.indexOf(index) + 1;
//     if (!colNum) return ""; 

//     const row = await fetchDyeingRow(selectedColour);
//     if (!row) return "0";
//     const rowValues = Object.values(row);
//     const value = rowValues[colNum] ?? "0";
//     return value ??'0'
    
//   } catch (err) {
//     console.error("getDyeingSec2Temp err:", err);
//     return "0";
//   }
// }

  
// export async function getDyeingSec2TimePh(selectedColour, index, dyeingSystem ) {

//   try {
//     const positionsArray = positions_dyeing[dyeingSystem];
//     if (!positionsArray) return "";

//   const colNum = positionsArray.indexOf(index) + 1;
//     if (!colNum) return ""; 

//     const row = await fetchDyeingRow(selectedColour);
//     if (!row) return "0";
//     const rowValues = Object.values(row);
//     const value = rowValues[colNum] ?? "0";
//     return value ??'0'
    
//   } catch (err) {
//     console.error("getDyeingSec2TimePh err:", err);
//     return "0";
//   }
// }


// export async function getDyeingSec2Dyestuff(selectedColour, dyePosition ) {

//   try {
//     const row = await fetchDyeingRow(selectedColour);
    
//     if (!row) return "";
//     const rowValues = Object.values(row);
    
//     const value = rowValues[dyePosition] ?? "";
//     return value ??''
    
//   } catch (err) {
//     console.error("getDyeingSec2Dyestuff err:", err);
//     return "";
//   }
// }

// export async function getDyeingSec2DyestuffAmt(selectedColour, dyePosition ) {

//   try {
//     const row = await fetchDyeingRow(selectedColour);
    
//     if (!row) return "";
//     const rowValues = Object.values(row);
    
//     const value = rowValues[dyePosition] ?? "";
    
//     return value ??''
    
//   } catch (err) {
//     console.error("getDyeingSec2DyestuffAmt err:", err);
//     return "";
//   }
// }

 
import { getDyeingRowCached } from "@/utils/dyeingCache";
import { fetchDyeingRow, fetchPrepareToDyeRow, fetchScouringRow } from "../../api/dyeingApi";
import { Colour_Chart, positions_dyeing, positions_prepare_to_dye, positions_scouring, Titles_Dyeing } from "../../utils/constants";

export async function getScouringChemGPL(scouring, selectedColour, position) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return ""; 
  const positionsArray = positions_scouring[scouring];
  if (!positionsArray) return ""; 

  
  const colNum = positionsArray.indexOf(position) + 1;
  if (!colNum) return ""; 

  try {
    
    const row = await fetchScouringRow(selectedColour);
    if (!row) return "0"; 

    
    const rowValues = Object.values(row);
    const amount = rowValues[colNum] ?? "0";

    return amount;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "0"; 
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
    if (!row) return "0";

    const rowValues = Object.values(row);
    let temp = rowValues[colNum] ?? "0";

    // Replace "?" with a the degree symbol
    if (typeof temp === "string") {
      temp = temp.replace("?", "˚"); 
    }

    return temp;
  } catch (err) {
    console.error("Failed to fetch scouring temp:", err);
    return "0";
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
    if (!row) return "0"; 

    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "0";

    return value;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "0"; 
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
    if (!row) return "0"; 

    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "0";

    return value;
  } catch (err) {
    console.error("Failed to fetch scouring GramsPL:", err);
    return "0"; 
  }
}




export async function getDyeingSec1ChemGpl(mode, selectedColour, scouring, b26Title) {

 let value;
 
  const positionsArray = positions_prepare_to_dye[scouring];
  if (!positionsArray) return ""; 

  const colNum = positionsArray.indexOf(4) + 1;
  if (!colNum) return ""; 
  
  const colIndex = Titles_Dyeing.indexOf(b26Title) + 1;
  if (colIndex === -1) return "";

  try {
    let row;
    row = await fetchPrepareToDyeRow(selectedColour);

    if (!row) return "0"; 
    const rowValues = Object.values(row);
    if (mode === "prepareToDye") {

     value = rowValues[colNum] ?? "0";
     return value ??'0'

  } 
  if (mode === "dyeing") {
    const row = await getDyeingRowCached(selectedColour);
    const dyeingrowValues = Object.values(row);
    value = dyeingrowValues[colIndex] ?? "0";
    return value ?? '0'
  }
  return value;

  } catch (err) {
    console.error("Failed to fetch DyeingSec1ChemGpl:", err);
    return "0"; 
  }
}



export async function getDyeingSec1ChemGpl2( selectedColour, b26Title) {
  if(!b26Title) return "";

  

  const colIndex = Titles_Dyeing.indexOf(b26Title) + 1;
  if (colIndex === -1) return "";

  try {
    const row = await getDyeingRowCached(selectedColour);
    const dyeingrowValues = Object.values(row);
    const value = dyeingrowValues[colIndex] ?? "0";
    return value ?? '0'
  
 } catch (err) {
    console.error("Failed to fetch DyeingSec1ChemGpl 2:", err);
    return "0"; 
  }
}


export async function getDyeingSec1ChemGpl1( selectedColour, scouring,) {

 let value;
 
  const positionsArray = positions_prepare_to_dye[scouring];
  if (!positionsArray) return ""; 

  const colNum = positionsArray.indexOf(4) + 1;
  if (!colNum) return ""; 

  try {
    let row;
    row = await fetchPrepareToDyeRow(selectedColour);
    
    if (!row) return "0"; 
    const rowValues = Object.values(row);
    value = rowValues[colNum] ?? "0";
     return value ??'0'

   } catch (err) {
    console.error("Failed to fetch DyeingSec1ChemGpl one 1:", err);
    return "0"; 
  }
}



export function getDyeingSec1ChemAmt1(C25, waterLitresDyeing, unit = "Kgs") {
  try {
    const product = C25 * waterLitresDyeing;

    if (product >= 1000) {
      // Divide by 1000, round to 1 decimal, append unit
      return (Math.round((product / 1000) * 10) / 10) + " "+  unit;
    } else {
      // Just round to 1 decimal
      return Math.round(product * 10) / 10 +  " "+  "gm";
    }
  } catch (e) {
    return ""; 
  }
}


export function getDyeingSec1ChemAmt2(C26, waterLitresDyeing, unit = "Kgs") {
  try {
    const product = C26 * waterLitresDyeing;

    if (product >= 1000) {
      // Divide by 1000, roundup to integer, append unit
      return Math.ceil(product / 1000) + " " + unit;
    } else {
      // Roundup to integer grams
      if (product <= 0) {
        return "";
      }
      return Math.ceil(product) + " " + " gm";
    }
  } catch (e) {
    return ""; 
  }
}






export async function getDyeingSec1Value(scouring,  selectedColour,dyeingSystem, positionCode)
  
{
  try {
    // Special case for CreamStripe (only if position 22/temperature)
    if (scouring === "CreamStripe" && positionCode === 22) {
      return "40˚C";
    }

    const positionsArray = positions_dyeing[dyeingSystem];
    if (!positionsArray) return "";

    const colNum = positionsArray.indexOf(positionCode) + 1;
    if (!colNum) return "";

    const row = await getDyeingRowCached(selectedColour);
    if (!row) return "0";
   
    const rowValues = Object.values(row);
    
    return rowValues[colNum] ?? "0";
    

  } catch (err) {
    console.error("Failed to fetch Dyeing value:", err);
    return "0";
  }
}




function normalizeSaltOption(option) {
  if (!option) return null;
  return option
    .replace(/[()]/g, "")   // remove brackets
    .replace(/\s+/g, "_");  // spaces → underscores
}

export async function getDyestuffGpl(selectedColour, index, saltOptionstep4) {
  try {
    const row = await getDyeingRowCached(selectedColour);
    if (!row) return "0";

    // Case 1: Salt / other chemical
    if (index === 6 && saltOptionstep4) {
      const dbKey = normalizeSaltOption(saltOptionstep4);
      const value = row[dbKey];
      return value ?? "";
    }

    // Case 2: Dyestuff (1–4)
    const key = `Dyestuff_${index}_Amt`;
    const value = row[key];

    return value ?? "";
  } catch (err) {
    console.error("getDyestuffGpl err:", err);
    return "0";
  }
}


export async function getDyeingSec2Temp(scouring, selectedColour, index, dyeingSystem ) {

  try {
    if (scouring === "CreamStripe") return "40˚C";

  const positionsArray = positions_dyeing[dyeingSystem];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await getDyeingRowCached(selectedColour);
    if (!row) return "0";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "0";
    return value ??'0'
    
  } catch (err) {
    console.error("getDyeingSec2Temp err:", err);
    return "0";
  }
}

  
export async function getDyeingSec2TimePh(selectedColour, index, dyeingSystem ) {

  try {
    const positionsArray = positions_dyeing[dyeingSystem];
    if (!positionsArray) return "";

  const colNum = positionsArray.indexOf(index) + 1;
    if (!colNum) return ""; 

    const row = await getDyeingRowCached(selectedColour);
    if (!row) return "0";
    const rowValues = Object.values(row);
    const value = rowValues[colNum] ?? "0";
    return value ??'0'
    
  } catch (err) {
    console.error("getDyeingSec2TimePh err:", err);
    return "0";
  }
}


export async function getDyeingSec2Dyestuff(selectedColour, dyePosition ) {

  try {
    const row = await getDyeingRowCached(selectedColour);
    
    if (!row) return "";
    const rowValues = Object.values(row);
    
    const value = rowValues[dyePosition] ?? "";
    return value ??''
    
  } catch (err) {
    console.error("getDyeingSec2Dyestuff err:", err);
    return "";
  }
}

export async function getDyeingSec2DyestuffAmt(selectedColour, dyePosition ) {

  try {
    const row = await getDyeingRowCached(selectedColour);
    
    if (!row) return "";
    const rowValues = Object.values(row);
    
    const value = rowValues[dyePosition] ?? "";
    
    return value ??''
    
  } catch (err) {
    console.error("getDyeingSec2DyestuffAmt err:", err);
    return "";
  }
}

 



  

   



  

   