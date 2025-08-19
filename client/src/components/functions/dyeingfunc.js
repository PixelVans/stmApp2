import React from "react";
import {
  Colour_Chart,
  Dyestuff_1,
  Dyestuff_2,
  Dyestuff_3,
  Dyestuff_4,
  Dyestuff_1_Amt,
  Dyestuff_2_Amt,
  Dyestuff_3_Amt,
  Dyestuff_4_Amt,
  temperatures_dyeing,
  positions_dyeing,
  duration_dyeing,
  ph_dyeing,
  Titles_Dyeing,
  industrialSaltGramsPerL,
  magadiSodaAshGramsPerL, 
  sodiumsulphateGramsPerL,
  causticSodaGramsPerL,
  saltTemperatures,
  saltDurations,
  scouringTemps,
  scouringDuration,
  scouringPHArray,
  positions_scouring,
  titles_scouring,
  titles_hotwash,
  positions_hotwash,
  positions_prepare_to_dye,
  titles_prepare_to_dye,
} from "../../utils/constants";

import { IgridientsHotwash } from "../../utils/IgridientsHotwash";
import { Igridientscouring } from "../../utils/Igridientscouring";
import { IngredientsPrepareToDye } from "../../utils/IngredientsPrepareToDye";
import { IngredientsDyeing } from "../../utils/IngredientsDyeing";

magadiSodaAshGramsPerL 
sodiumsulphateGramsPerL

const UNIT_KG = " Kgs";
const UNIT_G = " gms";


  

  

export function computeAmount(gramsPerLt, lotWeight) {
  if (!gramsPerLt || !lotWeight) return "";

  const totalGrams = gramsPerLt * (lotWeight * 10);

  if (totalGrams >= 1000) {
    const wholeKg = Math.trunc(totalGrams / 1000);
    const grams = totalGrams % 1000;
    return grams > 0
      ? `${wholeKg}${UNIT_KG} ${grams.toFixed(0)}${UNIT_G}`
      : `${wholeKg}${UNIT_KG}`;
  } else {
    return `${totalGrams.toFixed(0)}${UNIT_G}`;
  }
}


export function getDyeingTemp(scouringSystemSelected, colourSelected, dyeingSystemSelected) {
  if (scouringSystemSelected === "CreamStripe") return "40˚C";
  const rowIndex = Colour_Chart.indexOf(colourSelected);
 
  if (rowIndex === -1) return "";
  const positionArray = positions_dyeing[dyeingSystemSelected];
  if (!positionArray) return "";
  const dyeing_temp = temperatures_dyeing[rowIndex];
  return dyeing_temp;
}   

export function getDyeingTime( colourSelected, dyeingSystemSelected) {
 const rowIndex = Colour_Chart.indexOf(colourSelected)  ;

  if (rowIndex === -1) return "";
  
  const positionArray = positions_dyeing[dyeingSystemSelected];
  if (!positionArray) return "";

 
  const dyeing_duration = duration_dyeing[rowIndex];
  
  return dyeing_duration;
}                                                                                 



export function getDyeingPh(colourSelected, dyeingSystemSelected) {
  const rowIndex = Colour_Chart.indexOf(colourSelected);
  if (rowIndex === -1) return "";

  const positionArray = positions_dyeing[dyeingSystemSelected];
  if (!positionArray) return "";

  const dyeing_ph = ph_dyeing[rowIndex];

  return dyeing_ph
}


export const getChemicalField = ({
  saltPosition,
  saltOption,
  scouring,
  dyeingSystem,
  selectedColour
}) => {
  const isBlank = (val) =>
    val === null || val === undefined || String(val).trim() === "";

  // Helper: replicate INDEX/MATCH in Excel
  const pickByCode = (code) => {
    const positions = positions_dyeing[scouring] || [];
    const idx = positions.findIndex((p) => p === code);
    return Titles_Dyeing[idx] || "";
  };

  try {
    if (saltOption == "Industrial Salt" || saltPosition === "After Dyes") {
      if (saltOption == "Industrial Salt") {
        return pickByCode(5);
      } else {
        return pickByCode(7);
      }
    } else {
      if (scouring === "CreamStripe") {
        if (saltOption == "Industrial Salt") {
          return pickByCode(5);
        } else {
          return pickByCode(7);
        }
      } else {
        // Same as before: lookup by colour
        const colourIdx = Colour_Chart.findIndex(
          (c) => c === selectedColour
        );
        const dyeValue = Dyestuff_4[colourIdx];
        return isBlank(dyeValue) ? "" : dyeValue;
      }
    }
  } catch (err) {
    
    return "E";
  }
};


export function getSaltGramsPerL({ chemicalName, selectedColour }) {
const colourIdx = Colour_Chart.indexOf(selectedColour);
  
 
  if (colourIdx === -1) return ""; 

  switch (chemicalName) {
    case "Industrial Salt":
      return industrialSaltGramsPerL[colourIdx] ?? "";
    case "Sodium Sulphate (Glauber Salt)":
      return sodiumsulphateGramsPerL[colourIdx] ?? "";
    case "Magadi Soda Ash":
      return magadiSodaAshGramsPerL[colourIdx] ?? "";
    case "Caustic Soda":
      return causticSodaGramsPerL[colourIdx] ?? "";
    default:
      return "";
  }
}


const UNIT_KGs = "Kgs";
const UNIT_Gs = "gms";

function formatAmount(kg, g) {
  if (kg && g) {
    return `${kg}${UNIT_KGs} ${g}${UNIT_Gs}`;
  }
  if (kg) return `${kg}${UNIT_KGs}`;
  if (g) return `${g}${UNIT_Gs}`;
  return "0.00 gm";
}

export function computeDyeingSaltAmount({
  chemicalName,
  selectedColour,
  saltPosition,
  scouringSystemSelected,
  waterLitresDyeing,
  lotWeight,
}) {
  const gramsPerLt = getSaltGramsPerL({ chemicalName, selectedColour });
  if (!gramsPerLt || gramsPerLt === "") return "";

  const totalWater = gramsPerLt * waterLitresDyeing; // total grams by water litres
  const totalQuantity = gramsPerLt * lotWeight; // total grams by lot weight (assuming lotWeight in Kgs)

  // First condition: Salt_Position is blank or "After Dyes"
  if (!saltPosition || saltPosition === "After Dyes") {
    if (totalWater >= 1000) {
      // Round up to whole Kg
      const wholeKg = Math.ceil(totalWater / 1000);
      return formatAmount(wholeKg, null);
    } else {
      // Round up grams
      const grams = Math.ceil(totalWater);
      return formatAmount(null, grams);
    }
  }

  // Second condition: Scouring system is CreamStripe
  if (scouringSystemSelected === "CreamStripe") {
    if (totalWater >= 1000) {
      // Round to 1 decimal place for Kg
      const kg = +(totalWater / 1000).toFixed(1);
      return formatAmount(kg, null);
    } else {
      // Round to 1 decimal place grams (not common but per formula)
      const grams = +totalWater.toFixed(1);
      return formatAmount(null, grams);
    }
  }

  // Otherwise (default)
  if (totalQuantity >= 1100) { // since quantityKg * gramsPerLt >= 1.1 (kg) => 1100g
    const wholeKg = Math.trunc(totalQuantity / 1000);
    const grams = Math.round(totalQuantity - wholeKg * 1000);
    return formatAmount(wholeKg, grams);
  } else {
    if (Math.round(totalQuantity) === 0) return "";
    return formatAmount(null, Math.round(totalQuantity));
  }
}




export function getSaltDynamicTemp({ selectedColour, scouringSystemSelected }) {
  // If CreamStripe → fixed value
  if (scouringSystemSelected === "CreamStripe") {
    return "40˚C";
  }

  // Find the row index for the colour
  const rowIndex = Colour_Chart.indexOf(selectedColour);
  if (rowIndex === -1) return "";

  // Return matching temperature
  return saltTemperatures[rowIndex] ?? "";
}





export function getSaltDynamicDuration({ selectedColour }) {
  const rowIndex = Colour_Chart.indexOf(selectedColour);
  if (rowIndex === -1) return "";
  return saltDurations[rowIndex] ?? "";
}






export function getRemainInDwell({
  saltPosition,
  scouringSystemSelected,
  selectedColour,
 }) {
  // 1. Check salt position
  if (!saltPosition || saltPosition === "After Dyes") {
    return "REMAIN IN DWELL FOR 20 MINS";
  }

  // 2. Check scouring system
  if (scouringSystemSelected === "CreamStripe") {
    return "WAIT FOR 20 MINS";
  }

  // 3. Look up in Dyestuff_4
  const rowIndex = Colour_Chart.indexOf(selectedColour);
  if (rowIndex === -1) return "E"; // fallback like Excel error result

  const value = Dyestuff_4[rowIndex];
  if (!value) return "";

  return value;
}





export function computeStartingWaterAmount({
  lotWeight, // Quantity_Kgs_Dyeing
  liqRatio, // N3
  winch
}) {
  const dyeingMachineList = [
    "Soft Flow",
    "Main Winch",
    "Sample Winch",
    "Paddle Winch",
    "Soft Flow-Minimum",
    "VAT"
  ];

  const liquorRatioDyeing = [8, 8, 10, 15, 12, 12]; 

  if (!liqRatio) {
    const machineIndex = dyeingMachineList.indexOf(winch);
    if (machineIndex === -1) return "";
    return lotWeight * liquorRatioDyeing[machineIndex];
  } else {
    return lotWeight * liqRatio;
  }
}









export function getScouringTemp({ selectedColour, scouring }) {
  // 1. If system is CreamStripe or Chlorine
  if (scouring === "CreamStripe" || scouring === "Chlorine") {
    return "40˚C";
  }

  // 2. Find temperature from array based on selected colour
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return "";

  return scouringTemps[colourIdx] || "";
}





export function getScouringTime({ selectedColour }) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return "";
  return scouringDuration[colourIdx] || "";
}






export function getScouringPH({ selectedColour, scouring }) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return "";

  const positionArray = positions_scouring[scouring];
  if (!positionArray) return "";

  // Find where the 22 appears in the positions array
  const phPos = positionArray.indexOf(22);
  if (phPos === -1) return "";

  // Return from our pH array using the colour index
  return scouringPHArray[colourIdx] || "";
}









export function getScouringChemical1({ scouringSystem }) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const columnIdx = positionsArray.indexOf(1);
  if (columnIdx === -1) return "";

  return titles_scouring[columnIdx] ?? "";
}


export function getScouringChemical2({ scouringSystem }) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const columnIdx = positionsArray.indexOf(2);
  if (columnIdx === -1) return "";

  return titles_scouring[columnIdx] ?? "";

}

export function getScouringChemical3({ scouringSystem }) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const columnIdx = positionsArray.indexOf(3);
  if (columnIdx === -1) return "";

  return titles_scouring[columnIdx] ?? "";
}

export function getScouringChemical4({ scouringSystem }) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const columnIdx = positionsArray.indexOf(4);
  if (columnIdx === -1) return "REMAIN IN DWELL FOR 20 MINS";

  return titles_scouring[columnIdx] ?? "";
}

export function getScouringChemical5({ scouringSystem }) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const columnIdx = positionsArray.indexOf(5);
  if (columnIdx === -1) return "";

  return titles_scouring[columnIdx] ?? "";
}


export function getScouringChemical6({ scouringSystem }) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const columnIdx = positionsArray.indexOf(6);
  if (columnIdx === -1) return "";

  return titles_scouring[columnIdx] ?? "";
}


export function getScouringChemical7({ scouringSystem }) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const columnIdx = positionsArray.indexOf(7);
  if (columnIdx === -1) return "";

  return titles_scouring[columnIdx] ?? "";
}










export function getScouringPL( scouring, selectedColour, position ) {
  const colourIdx = Colour_Chart.indexOf(selectedColour);
  
  
  if (colourIdx === -1) return ""; 
  
  const positionsArray = positions_scouring[scouring];
  
  if (!positionsArray) return ""; 

  const colIdx = positionsArray.indexOf(position);
  if (colIdx === -1) return "";
  
  const row = Igridientscouring[colourIdx];
  if (!row) return "";
  
  return Number(row[colIdx])?? "";
}




export function getScouringChemicalAmount(
  scouring,
  selectedColour,
  position,
  lotWeight,
  liqRatio,
  winch,
) {
  const unitKgs = " Kgs";
  const unitGrams = " g";

  // Step 1: C8 equivalent → grams per litre
  const gramsPerLt = getScouringPL(scouring, selectedColour, position);

  // Step 2: Water litres Dyeing
  const waterLitres = computeStartingWaterAmount({ lotWeight, liqRatio, winch });

  // Step 3: total grams
  const totalGrams = gramsPerLt * waterLitres;

  if (isNaN(totalGrams)) return "";

  // Step 4: return with correct units
  if (totalGrams >= 1000) {
    const kgs = totalGrams / 1000;
    return `${Number.isInteger(kgs) ? kgs.toFixed(0) : kgs.toFixed(1)}${unitKgs}`;
  } else if (totalGrams <= 0) {
    return "";
  }

  return `${totalGrams.toFixed(0)}${unitGrams}`;
}







export function getHotWashTitle1(dyeingSystem) {
  const positions = positions_hotwash[dyeingSystem];
  if (!positions) return "";

  const matchIndex = positions.findIndex(pos => pos === 1);
  if (matchIndex === -1) return "";

  return titles_hotwash[matchIndex] || "";
}

export function getHotWashTitle2(dyeingSystem) {
  const positions = positions_scouring[dyeingSystem];
  if (!positions) return "";

  const matchIndex = positions.findIndex(pos => pos === 9);
  if (matchIndex === -1) return "";

  return titles_hotwash[matchIndex] || "";
}








export function getgramsPLForHotwash(selectedColour, dyeingSystem) {

  const colourIdx = Colour_Chart.indexOf(selectedColour);
  if (colourIdx === -1) return ""; 

  // Get the positions array for the selected system
  const positions = positions_scouring[dyeingSystem];
  if (!positions) return "";

  // Find column index where position = 9
  const colIndex = positions.findIndex(pos => pos === 9);
  if (colIndex === -1) return "";

  // Get the row for the selected colour
  const row = Igridientscouring[colourIdx ];
  if (!row) return "";

  // Return the value at the found column
  return row[colIndex] ?? "";
}





export function computeRoundedWater80({ lotWeight, liqRatio, winch }) {
  const waterLitres = computeStartingWaterAmount({ lotWeight, liqRatio, winch });
  return Math.ceil(waterLitres * 0.8); // ROUNDUP 
}






export function computeHotwashAmount({ selectedColour, dyeingSystem, lotWeight, liqRatio, winch }) {
  try {
    const gramsPL = getgramsPLForHotwash(selectedColour, dyeingSystem); // C17
    const waterLitres = computeStartingWaterAmount({ lotWeight, liqRatio, winch }); // Water_Litres_Dyeing
    const total = gramsPL * waterLitres;

    if (total >= 1000) {
      return `${(total / 1000).toFixed(1)} Kgs`; 
    } else {
      return total;
    }
  } catch (e) {
    return "";
  }
}







export function getHotwashTemp(selectedColour, dyeingSystem) {

  try {
    const colourIdx = Colour_Chart.indexOf(selectedColour);
    if (colourIdx === -1) return ""; 
    // Step 1: get column index for Excel position 20
    const colIndex = positions_hotwash[dyeingSystem].indexOf(20);
    if (colIndex === -1) return "";

    // Step 2: fetch the value from IgridientsHotwash
    return IgridientsHotwash[colourIdx][colIndex];
  } catch (e) {
    return "";
  }

}

export function getHotwashDuration(selectedColour, dyeingSystem) {

  try {
    const colourIdx = Colour_Chart.indexOf(selectedColour);
    if (colourIdx === -1) return ""; 
    // Step 1: get column index for Excel position 20
    const colIndex = positions_hotwash[dyeingSystem].indexOf(21);
    if (colIndex === -1) return "";

    // Step 2: fetch the value from IgridientsHotwash
    return IgridientsHotwash[colourIdx][colIndex];
  } catch (e) {
    return "";
  }

}

export function getHotwashPh(selectedColour, dyeingSystem) {

  try {
    const colourIdx = Colour_Chart.indexOf(selectedColour);
    if (colourIdx === -1) return ""; 
    // Step 1: get column index for Excel position 20
    const colIndex = positions_hotwash[dyeingSystem].indexOf(22);
    if (colIndex === -1) return "";

    // Step 2: fetch the value from IgridientsHotwash
    return IgridientsHotwash[colourIdx][colIndex];
  } catch (e) {
    return "";
  }

}





export function getPrepareToDyeTitle1(scouring) {
  try {
    // Step 1: Find the index where position = 1
    const colIndex = positions_prepare_to_dye[scouring].indexOf(1);
    if (colIndex === -1) return "";

    // Step 2: Return the matching title
    return titles_prepare_to_dye[colIndex];
  } catch (e) {
    return "";
  }
}


export function getPrepareToDyeTitle2(scouring, isI21Blank) {
  try {
    // Decide which Excel "position number" to look for
    const targetPosition = isI21Blank ? 3 : 6;

    // Find index of that position in the positions array
    const colIndex = positions_prepare_to_dye[scouring].indexOf(targetPosition);

    // If not found, return "E"
    if (colIndex === -1) return "E";

    // Return the matching title
    return titles_prepare_to_dye[colIndex];
  } catch (e) {
    return "E";
  }
}



export function getPrepareToDyeTitle3(scouring) {
  try {
    // Find the column index for Excel position 2
    const colIndex = positions_prepare_to_dye[scouring].indexOf(2);

    // If not found, return empty string
    if (colIndex === -1) return "";

    return titles_prepare_to_dye[colIndex];
  } catch {
    return "";
  }
}




export function getPrepareToDyeGPL1(dyeingSystem, selectedColour) {
  try {
    if (dyeingSystem !== "VAT") return "";

    // Find the row index of the selected colour
    const rowIndex = Colour_Chart.indexOf(selectedColour);
    if (rowIndex === -1) return "";

    const value = Dyestuff_1_Amt[rowIndex];

    // If blank or null, return ""
    if (value === null || value === undefined || value === "") {
      return "";
    }

    return value;
  } catch {
    return "";
  }
}





export function getPrepareToDyeGPL2(
  dyeingSystem,
  selectedColour,
  I21,
  scouring
) {
  try {
    const rowIndex = Colour_Chart.indexOf(selectedColour);
    if (rowIndex === -1) return "";

    // VAT logic
    if (dyeingSystem === "VAT") {
      const value = Dyestuff_2_Amt[rowIndex];
      return (value === null || value === undefined || value === "") ? "" : value;
    }

    // Non-VAT logic
    const posArray = positions_prepare_to_dye[scouring];
    if (!posArray) return "";

    // If I21 is blank → use position index for 3
    if (I21 === null || I21 === undefined || I21 === "") {
      const colIndex = posArray.indexOf(3);
      if (colIndex === -1) return "";
      return IngredientsPrepareToDye[rowIndex][colIndex];
    }

    // Otherwise → use position index for 6
    const colIndex = posArray.indexOf(6);
    if (colIndex === -1) return "";
    return IngredientsPrepareToDye[rowIndex][colIndex];
  } catch {
    return "";
  }
}




export function getPrepareToDyeGPL3(
  dyeingSystem,
  selectedColour,
  scouring
) {
  try {
    const rowIndex = Colour_Chart.indexOf(selectedColour);
    if (rowIndex === -1) return "";

    // VAT logic
    if (dyeingSystem === "VAT") {
      const value = Dyestuff_3_Amt[rowIndex];
      return (value === null || value === undefined || value === "") ? "" : value;
    }

    // Non-VAT logic
    const posArray = positions_prepare_to_dye[scouring];
    if (!posArray) return "";

    const colIndex = posArray.indexOf(2);
    if (colIndex === -1) return "";

    return IngredientsPrepareToDye[rowIndex][colIndex];
  } catch {
    return "";
  }
}




export function getPrepareToDyeAmt({
  gpl,               
  dyeingSystem,
  lotWeight,        
  waterLitresDyeing, 
  isAmt1 = false,
  standards = { kgs: "Kgs", gms: "gms", ltrs: "Ltrs" }
}) {
  try {
    // Zero handling first
    if (isAmt1 && dyeingSystem !== "VAT" && waterLitresDyeing === 0) {
      return `0 ${standards.ltrs}`;
    }
    if (!isAmt1 && gpl === 0) {
      return `0 ${standards.gms}`;
    }

    // VAT branch
    if (dyeingSystem === "VAT") {
      const vatValue = (gpl / 100) * lotWeight; // gpl% * lotWeight
      if (vatValue === 0) return `0 ${standards.gms}`;

      if (vatValue >= 1.1) {
        const kgsPart = `${Math.trunc(vatValue)}${standards.kgs}`;
        const gmsPart = `${Math.round(
          Math.floor(vatValue * 1000) - Math.trunc(vatValue) * 1000
        )}${standards.gms}`;
        return kgsPart + gmsPart;
      } else {
        return `${Math.round(vatValue * 1000)}${standards.gms}`;
      }
    }

    // Non-VAT branch
    if (isAmt1) {
      // Matches Excel's ROUNDUP(Water_Litres_Dyeing * 0.8, 0)
      return `${Math.ceil(waterLitresDyeing * 0.8)} ${standards.ltrs}`;
    } else {
      const nonVatValue = gpl * waterLitresDyeing;
      if (nonVatValue === 0) return `0 ${standards.gms}`;

      if (nonVatValue >= 1000) {
        return `${(Math.round((nonVatValue / 1000) * 10) / 10)}${standards.kgs}`;
      } else {
        return `${Math.round(nonVatValue * 10) / 10}${standards.gms}`;
      }
    }
  } catch {
    return "E";
  }
}



export function getPrepareToDyeAmt1({
  gpl,               // This is $C$20 in Excel (%)
  dyeingSystem,      // Dyeing_System_Selected
  lotWeight,         // Quantity_Kgs_Dyeing
  waterLitresDyeing, // Water_Litres_Dyeing
  
}) {
  
  const standards = { kgs: "Kgs", gms: "gms", ltrs: "Ltrs" }
  try {
    // Excel: IFERROR(..., "E")
    if (gpl === null || gpl === undefined || isNaN(gpl)) return "E";

    if (dyeingSystem === "VAT") {
      const vatValue = (gpl / 100) * lotWeight;

      if (vatValue >= 1.1) {
        const kgsPart = `${Math.trunc(vatValue)}${standards.kgs}`;
        const gmsPart = `${Math.round(
          Math.floor(vatValue * 1000) - Math.trunc(vatValue) * 1000
        )}${standards.gms}`;
        return kgsPart + gmsPart;
      } else {
        return `${Math.round(vatValue * 1000)}${standards.gms}`;
      }
    }

    // Non-VAT case → ROUNDUP(Water_Litres_Dyeing * 0.8, 0) Ltrs
    return `${Math.ceil(waterLitresDyeing * 0.8)} ${standards.ltrs}`;
  } catch {
    return "E";
  }
}




export function getPrepareToDyeTemp({
  scouring,
  dyeingSystem,
  selectedColour,
 }) {
  try {
    if (scouring === "CreamStripe") return "40˚C";

    const positionTable = positions_prepare_to_dye[dyeingSystem];
    if (!IngredientsPrepareToDye || !positionTable) return "";

    const rowIndex = Colour_Chart.indexOf(selectedColour);
    if (rowIndex === -1) return "";

    const colIndex = positionTable.indexOf(20);
    if (colIndex === -1) return "";

    return IngredientsPrepareToDye[rowIndex][colIndex] ?? "";
  } catch {
    return "";
  }
}




export function getPrepareToDyeProperty(
  propertyCode,
  dyeingSystem,
  selectedColour,
  
) {
  try {
    
    const positionTable = positions_prepare_to_dye[dyeingSystem];
    if (!IngredientsPrepareToDye || !positionTable) return "";

    const rowIndex = Colour_Chart.indexOf(selectedColour);
    if (rowIndex === -1) return "";

    const colIndex = positionTable.indexOf(propertyCode);
    if (colIndex === -1) return "";

    return IngredientsPrepareToDye[rowIndex][colIndex] ?? "";
  } catch {
    return "";
  }
}




export function step4sec1Chemical1({
  dyeingSystem,
  saltPosition
}) {

  try {
    const titlesTable = titles_prepare_to_dye;
    const positionTable = positions_prepare_to_dye[dyeingSystem];
    if (!titlesTable || !positionTable) return "E";

    const colIndex = positionTable.indexOf(4);
    if (colIndex === -1) return "E";

    if (!saltPosition) {
      // Branch 1 - same as branch 2 currently
      return titlesTable[colIndex] ?? "E";
    } else {
      // Branch 2 - same result in your Excel formula
      return titlesTable[colIndex] ?? "E";
    }
  } catch {
    return "Er";
  }
}






export function step4sec1Chemical2({
  saltOption, // "Industrial Salt", "After Dyes", etc.
  scouring
}) {
  try {
    // 1. Salt position filter
    if (!saltOption || saltOption === "After Dyes") {
      return ""; // Excel: ""
    }

    // 2. CreamStripe case
    if (scouring === "CreamStripe") {
      return "";
    }
    const colNumber = saltOption == "Industrial Salt" ? 5 : 7;
    
    // 4. Lookups
    if (!Titles_Dyeing || !positions_dyeing || !positions_dyeing[scouring]) return "";

    const colIndex = positions_dyeing[scouring].indexOf(colNumber);
    if (colIndex === -1) return "";

    return Titles_Dyeing[colIndex] ?? "";
  } catch {
    return "";
  }
}




export function step4sec1ChemicalGpl({
  mode,              // "prepareToDye" or "dyeing"
  selectedColour,
  scouring,          // Only needed for prepareToDye
  b26Title           // Only needed for dyeing
}) {
  try {
    
    const rowIndex = Colour_Chart.indexOf(selectedColour);
    if (rowIndex === -1) return "";

    if (mode === "prepareToDye") {
      // Excel: MATCH(4, Position_prepareToDye_scouring, 0)
      const posArray = positions_prepare_to_dye[scouring];
      if (!posArray) return "";

      const colIndex = posArray.indexOf(4);
      if (colIndex === -1) return "";

      return IngredientsPrepareToDye[rowIndex][colIndex] ?? "";
    }

    if (mode === "dyeing") {
      // Excel: MATCH(B26, Titles_Dyeing, 0)
      const colIndex = Titles_Dyeing.indexOf(b26Title);
      if (colIndex === -1) return "";
      return IngredientsDyeing[rowIndex][colIndex] ?? "";
    }

    return "";
  } catch {
    return "";
  }
}





export function step4sec1ChemicalAmt({
  gplValue,            // from step4sec1ChemicalGpl(...) — already as number
  waterLitresDyeing,
  isAmt1 = true,        // true → Amt1 logic (ROUND), false → Amt2 logic (ROUNDUP)
  standards = { kgs: "Kgs", gms: "gms" }
}) {
  try {
    if (!gplValue || !waterLitresDyeing) return `0 ${standards.gms}`;

    const total = gplValue * waterLitresDyeing;

    if (total >= 1000) {
      // Kgs branch
      const valueInKgs = total / 1000;
      return isAmt1
        ? `${Math.round(valueInKgs * 10) / 10}${standards.kgs}` // ROUND to 1 decimal
        : `${Math.ceil(valueInKgs)}${standards.kgs}`;           // ROUNDUP integer
    } else {
      // gms branch
      return isAmt1
        ? `${Math.round(total * 10) / 10}${standards.gms}` // ROUND to 1 decimal
        : `${Math.ceil(total)}${standards.gms}`;           // ROUNDUP integer
    }
  } catch {
    return "";
  }
}








