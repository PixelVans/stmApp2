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
  Titles_First_Rinse,
  positions_first_rinse,
  positions_soaping,
  Titles_Soaping,
  positions_final_rinse,
  Titles_Final_Rinse,
  Titles_Finishing,
  positions_finishing,
} from "../../utils/constants";

import { IgridientsHotwash } from "../../utils/IgridientsHotwash";
import { Igridientscouring } from "../../utils/Igridientscouring";
import { IngredientsPrepareToDye } from "../../utils/IngredientsPrepareToDye";
import { IngredientsDyeing } from "../../utils/IngredientsDyeing";



export function getScouringSummaryChem3(scouringSystem) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const matchVal = (scouringSystem === "CreamStripe" || scouringSystem === "Chlorine") ? 5 : 4;
  const columnIdx = positionsArray.indexOf(matchVal);

  return columnIdx !== -1 ? titles_scouring[columnIdx] ?? "" : "";
}


export function getScouringSummaryChem4(scouringSystem) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const matchVal = (scouringSystem === "CreamStripe") ? 6 : 5;
  const columnIdx = positionsArray.indexOf(matchVal);

  return columnIdx !== -1 ? titles_scouring[columnIdx] ?? "" : "";
}


export function getScouringSummaryChem(scouringSystem, matchValIfCream, matchValElse) {
  const positionsArray = positions_scouring[scouringSystem];
  if (!positionsArray) return "";

  const matchVal = (scouringSystem === "CreamStripe") ? matchValIfCream : matchValElse;
  const columnIdx = positionsArray.indexOf(matchVal);

  return columnIdx !== -1 ? titles_scouring[columnIdx] ?? "" : "";
}



export function getPrepareToDyeSummaryChem(scouringSystem, matchVal) {
  const positionsArray = positions_prepare_to_dye[scouringSystem];
  if (!positionsArray) return "E";

  const columnIdx = positionsArray.indexOf(matchVal);

  return columnIdx !== -1 ? titles_prepare_to_dye[columnIdx] ?? "E" : "E";
}



export function getDyeingChem4(scouringSystem, saltPosition, saltOption) {
  const positionsArray = positions_dyeing[scouringSystem];
  if (!positionsArray) return "E";

  // Case 1: Salt_Position empty or "After Dyes"
  if (!saltPosition || saltPosition === "After Dyes") {
    return "";
  }

  let matchVal;
  // Case 2: If J3 is blank → use 5, else → use 7
  if (saltOption == "Industrial Salt") {
    matchVal = 5;
  } else {
    matchVal = 7;
  }

  const columnIdx = positionsArray.indexOf(matchVal);
  return columnIdx !== -1 ? Titles_Dyeing[columnIdx] ?? "E" : "E";
}


export function getDyeingChem5(scouringSystem, saltPosition, saltOption) {
  const positionsArray = positions_dyeing[scouringSystem];
  if (!positionsArray) return "E";

  // Case 1: Salt_Position is "" or "After Dyes"
  if (!saltPosition || saltPosition === "After Dyes") {
    let matchVal = saltOption == "Industrial Salt" ? 5 : 7;
    const columnIdx = positionsArray.indexOf(matchVal);
    return columnIdx !== -1 ? Titles_Dyeing[columnIdx] ?? "E" : "E";
  }

  // Case 2: otherwise → return ""
  return "";
}





export function getKgsNeededScouringChem1(
  scouringSystem,
  waterLitresDyeing,
  c8,
  c48,
  c60,
) {
  try {
    const unitKgs = " Kgs";
    const unitGrams = " g";

    // Make sure they’re numbers
    c8 = parseFloat(c8) || 0;
    c48 = parseFloat(c48) || 0;
    c60 = parseFloat(c60) || 0;
    waterLitresDyeing = parseFloat(waterLitresDyeing) || 0;

    let totalGrams;
   if (scouringSystem === "Reactive") {
      totalGrams = c8 * waterLitresDyeing + c60 * waterLitresDyeing;
    } else if (scouringSystem === "Enzymatic" || scouringSystem === "Chlorine") {
      totalGrams = c8 * waterLitresDyeing;
    } else {
      totalGrams = c8 * waterLitresDyeing + c48 * waterLitresDyeing;
    }

    if (isNaN(totalGrams) || totalGrams <= 0) return "E";

    if (totalGrams >= 1000) {
      const kgs = totalGrams / 1000;
      return `${Number.isInteger(kgs) ? kgs.toFixed(0) : kgs.toFixed(1)}${unitKgs}`;
    } else {
      return `${totalGrams.toFixed(0)}${unitGrams}`;
    }
  } catch (e) {
    console.error(e);
    return "E";
  }
}




// dyeingSummaryFunctions.js
export function getKgsNeededScouringChem2(
  scouringSystem,
  waterLitresDyeing,
  c9,
  c13,
  c49
) {
  try {
    const unitKgs = " Kgs";
    const unitGrams = " g";

    // Ensure numbers
    c9 = parseFloat(c9) || 0;
    c13 = parseFloat(c13) || 0;
    c49 = parseFloat(c49) || 0;
    waterLitresDyeing = parseFloat(waterLitresDyeing) || 0;

    let totalGrams = 0;

    if (scouringSystem === "CreamStripe") {
      // CreamStripe path: (C9 + C13 + C49) * WaterLitres
      totalGrams = (c9 + c13 + c49) * waterLitresDyeing;
    } else {
      // Other systems path: (C9 + C49) * WaterLitres
      totalGrams = (c9 + c49) * waterLitresDyeing;
    }

    if (isNaN(totalGrams) || totalGrams <= 0) return "E";

    // Convert to correct units
    if (totalGrams >= 1000) {
      const kgs = totalGrams / 1000;
      return `${Number.isInteger(kgs) ? kgs.toFixed(0) : kgs.toFixed(1)}${unitKgs}`;
    } else {
      return `${totalGrams.toFixed(0)}${unitGrams}`;
    }
  } catch (e) {
    console.error(e);
    return "E";
  }
}



export function getKgsNeededScouringChem3(
  scouringSystem,
  waterLitresDyeing,
  c10,
  c11,
  c48
) {
  try {
    const unitKgs = " Kgs";
    const unitGrams = " g";

    // ensure numeric
    c10 = parseFloat(c10) || 0;
    c11 = parseFloat(c11) || 0;
    c48 = parseFloat(c48) || 0;
    waterLitresDyeing = parseFloat(waterLitresDyeing) || 0;

    let totalGrams;

    if (scouringSystem === "Reactive") {
      totalGrams = c10 * waterLitresDyeing + c48 * waterLitresDyeing;
    } else if (scouringSystem === "Enzymatic") {
      totalGrams = c10 * waterLitresDyeing;
    } else {
      totalGrams = c11 * waterLitresDyeing;
    }

    if (isNaN(totalGrams) || totalGrams <= 0) return "";

    if (totalGrams >= 1000) {
      const kgs = totalGrams / 1000;
      return `${Number.isInteger(kgs) ? kgs.toFixed(0) : kgs.toFixed(1)}${unitKgs}`;
    } else {
      return `${totalGrams.toFixed(0)}${unitGrams}`;
    }
  } catch (e) {
    console.error(e);
    return "Zero";
  }
}




export function getKgsNeededScouringChem4(
  scouringSystem,
  waterLitresDyeing,
  c8,
  c11,
  c48
) {
  try {
    const unitKgs = " Kgs";
    const unitGrams = " g";

    // ensure numbers
    c8 = parseFloat(c8) || 0;
    c11 = parseFloat(c11) || 0;
    c48 = parseFloat(c48) || 0;
    waterLitresDyeing = parseFloat(waterLitresDyeing) || 0;

    let totalGrams = 0;

    if (scouringSystem === "Reactive") {
      totalGrams = c11 * waterLitresDyeing;
    } else if (scouringSystem === "Enzymatic") {
      totalGrams = c11 * waterLitresDyeing + c48 * waterLitresDyeing;
    } else if (scouringSystem === "CreamStripe") {
      totalGrams = c8 * waterLitresDyeing + c48 * waterLitresDyeing;

      if (totalGrams < 1000) {
        // special Excel quirk: only return c48 * litres, not the whole sum
        const grams = c48 * waterLitresDyeing;
        return `${grams.toFixed(0)}${unitGrams}`;
      }
    } else {
      return "";
    }

    if (isNaN(totalGrams) || totalGrams <= 0) return "E";

    if (totalGrams >= 1000) {
      const kgs = totalGrams / 1000;
      return `${Number.isInteger(kgs) ? kgs.toFixed(0) : kgs.toFixed(1)}${unitKgs}`;
    } else {
      return `${totalGrams.toFixed(0)}${unitGrams}`;
    }
  } catch (e) {
    console.error(e);
    return "E";
  }
}




export function getKgsNeededScouringChem5(scouringSystem, waterLitresDyeing, c12) {
  try {
    const unitKgs = " Kgs";
    const unitGrams = " g";

    c12 = parseFloat(c12) || 0;
    waterLitresDyeing = parseFloat(waterLitresDyeing) || 0;

    if (scouringSystem !== "Reactive") return ""; // Excel’s "Zero"

    const totalGrams = c12 * waterLitresDyeing;
    if (isNaN(totalGrams) || totalGrams <= 0) return "E";

    if (totalGrams >= 1000) {
      const kgs = totalGrams / 1000;
      return `${Number.isInteger(kgs) ? kgs.toFixed(0) : kgs.toFixed(1)}${unitKgs}`;
    } else {
      return `${totalGrams.toFixed(0)}${unitGrams}`;
    }
  } catch (e) {
    console.error(e);
    return "E";
  }
}

export function getKgsNeededScouringChem6(scouringSystem, waterLitresDyeing, c13) {
  try {
    const unitKgs = " Kgs";
    const unitGrams = " g";

    c13 = parseFloat(c13) || 0;
    waterLitresDyeing = parseFloat(waterLitresDyeing) || 0;

    if (scouringSystem !== "Reactive") return ""; // Excel’s "Zero"

    const totalGrams = c13 * waterLitresDyeing;
    if (isNaN(totalGrams) || totalGrams <= 0) return "E";

    if (totalGrams >= 1000) {
      const kgs = totalGrams / 1000;
      return `${Number.isInteger(kgs) ? kgs.toFixed(0) : kgs.toFixed(1)}${unitKgs}`;
    } else {
      return `${totalGrams.toFixed(0)}${unitGrams}`;
    }
  } catch (e) {
    console.error(e);
    return "E";
  }
}




// prepare to dye functions
export function getprepareToDyeChem1KgsNeeded(waterLitresDyeing, c21, c59) {
  try {
    const grams = c21 * waterLitresDyeing + c59 * waterLitresDyeing;
    if (isNaN(grams)) return "E";
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} Kgs`;
    }
    return `${grams.toFixed(0)} g`;
  } catch {
    return "E";
  }
}

export function getprepareToDyeChem2KgsNeeded(waterLitresDyeing, c22) {
  try {
    const grams = c22 * waterLitresDyeing;
    if (isNaN(grams)) return "E";
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} Kgs`;
    }
    return `${grams.toFixed(0)} g`;
  } catch {
    return "E";
  }
}

export function getprepareToDyeChem3KgsNeeded(waterLitresDyeing, c25) {
  try {
    const grams = c25 * waterLitresDyeing;
    if (isNaN(grams)) return "E";
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} Kgs`;
    }
    return `${grams.toFixed(0)} g`;
  } catch {
    return "E";
  }
}

export function getprepareToDyeChem4KgsNeeded(waterLitresDyeing, c26, c34, saltPosition, scouringSystem) {
  try {
    if (!saltPosition || saltPosition === "After Dyes") return "";

    let grams;
    if (scouringSystem === "CreamStripe") {
      grams = c34 * waterLitresDyeing;
    } else {
      grams = c26 * waterLitresDyeing;
    }

    if (isNaN(grams)) return "E";
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} Kgs`;
    }
    return `${grams.toFixed(0)} g`;
  } catch {
    return "E";
  }
}


function formatKgsGms(valueKg) {
  if (isNaN(valueKg)) return "E";

  if (valueKg >= 1.1) {
    const kgs = Math.trunc(valueKg);                     // whole kilos
    const gms = Math.round((valueKg - kgs) * 1000);      // remainder as grams
    return `${kgs} Kgs${gms > 0 ? " " + gms + " gms" : ""}`;
  } else {
    // less than 1.1 kg → only grams
    return `${Math.round(valueKg * 1000)} gms`;
  }
}





export function getDyeingChem1KgsNeeded(lotWeight, c29) {
  try {
    return formatKgsGms((c29 / 100) * lotWeight);  // <-- FIXED
  } catch {
    return "E";
  }
}


export function getDyeingChem2KgsNeeded(lotWeight, c30) {
  try {
    return formatKgsGms((c30 / 100) * lotWeight);
  } catch {
    return "E";
  }
}

export function getDyeingChem3KgsNeeded(lotWeight, c31) {
  try {
    return formatKgsGms((c31 / 100) * lotWeight);
  } catch {
    return "E";
  }
}

export function getDyeingChem4KgsNeeded(lotWeight, c32) {
  try {
    const valueKg = (c32 / 100) * lotWeight;
    if (Math.round(valueKg * 1000) === 0) return ""; // Excel's Zero case
    return formatKgsGms(valueKg);
  } catch {
    return "E";
  }
}

export function getDyeingChem5KgsNeeded(lotWeight, waterLitresDyeing, c34, saltPosition, scouringSystem) {
  try {
    if (!saltPosition || saltPosition === "After Dyes") {
      const valueKg = (c34 / 100) * waterLitresDyeing;
      if (valueKg >= 1) {
        return `${Math.ceil(valueKg)} Kgs`;
      }
      return `${Math.ceil(valueKg * 1000)} gms`;
    }
    if (scouringSystem === "CreamStripe") return "";
    return formatKgsGms(c34 * lotWeight);
  } catch {
    return "E";
  }
}



export function getFinishingChem1KgsNeeded(waterLitresDyeing, c66) {
  try {
    const value = c66 * waterLitresDyeing;

    if (Math.round(value * 10) / 10 >= 1000) {
      // convert to kilos
      return `${(Math.round((value / 1000) * 10) / 10)} Kgs`;
    }

    // otherwise grams
    return `${(Math.round(value * 10) / 10)} gms`;
  } catch {
    return "E";
  }
}


export function getFinishingChem2KgsNeeded(waterLitresDyeing, c25, dyeFixSelection) {
  try {
    if (dyeFixSelection !== "Dye Fix") return "0";  // matches Excel's "Zero" case

    const value = c25 * waterLitresDyeing;

    if (Math.round(value * 10) / 10 >= 1000) {
      return `${(Math.round((value / 1000) * 10) / 10)} Kgs`;
    }

    return `${(Math.round(value * 10) / 10)} gms`;
  } catch {
    return "E";
  }
}








