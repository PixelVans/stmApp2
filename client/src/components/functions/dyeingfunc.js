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
} from "../../utils/constants";

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
      ? `${wholeKg}${UNIT_KG} ${grams.toFixed(3)}${UNIT_G}`
      : `${wholeKg}${UNIT_KG}`;
  } else {
    return `${totalGrams.toFixed(3)}${UNIT_G}`;
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
    console.error("Error in getChemicalField:", err);
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




