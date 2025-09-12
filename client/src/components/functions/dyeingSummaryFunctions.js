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
import { fetchChemicalsRow, fetchDyeStuffsRow,  } from "../../api/dyeingApi";


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

    if (isNaN(grams)) return "";
    if (grams >= 1000) {
      return `${(grams / 1000)} Kgs`;
    }
    return `${grams.toFixed(0)} g`;
  } catch {
    return "";
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
  if(!c29)return ''
  try {
    return formatKgsGms((c29 / 100) * lotWeight);  // <-- FIXED
  } catch {
    return "E";
  }
}


export function getDyeingChem2KgsNeeded(lotWeight, c30) {
  if(!c30)return ''
  try {
    return formatKgsGms((c30 / 100) * lotWeight);
  } catch {
    return "E";
  }
}

export function getDyeingChem3KgsNeeded(lotWeight, c31) {
  try {
    if(!c31)return ''
    return formatKgsGms((c31 / 100) * lotWeight);
  } catch {
    return "E";
  }
}

export function getDyeingChem4KgsNeeded(lotWeight, c32) {
  try {
    if(!c32)return ''
    const valueKg = (c32 / 100) * lotWeight;
    if (Math.round(valueKg * 1000) === 0) return ""; // Excel's Zero case
    return formatKgsGms(valueKg);
  } catch {
    return "E";
  }
}

export function getDyeingChem5KgsNeeded(lotWeight, waterLitresDyeing, c34, saltPosition, scouringSystem) {
  try {
    if(!c34)return ''
    if (!saltPosition || saltPosition === "After Dyes") {
      const valueKg = (c34 / 1000) * waterLitresDyeing;
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
    if(!c66)return ''
    const value = c66 * waterLitresDyeing;

    if (Math.round(value * 10) / 10 >= 1000) {
      
      return `${(Math.round((value / 1000) * 10) / 10)} Kgs`;
    }

    return `${(Math.round(value * 10) / 10)} gms`;
  } catch {
    return "E";
  }
}


export function getFinishingChem2KgsNeeded(waterLitresDyeing, c25, dyeFixSelection) {
  try {
    if(!c25)return ''
    if (dyeFixSelection !== "Dye Fix") return "";

    const value = c25 * waterLitresDyeing;

    if (Math.round(value * 10) / 10 >= 1000) {
      return `${(Math.round((value / 1000) * 10) / 10)} Kgs`;
    }

    return `${(Math.round(value * 10) / 10)} gms`;
  } catch {
    return "E";
  }
}





export async function getChemicalsAmtonHand(chemical) {
  try {
    const row = await fetchChemicalsRow(chemical);
    if (!row) return "dbErr";

    const rowValues = Object.values(row);
    const value = rowValues[3] ?? "";

    // console.log(`The amount in hand for ${chemical} is ${value}`);

    return `${value} kgs`; 
  } catch (err) {
    console.error("Failed to fetch chemicals row", err);
    return ""; 
  }
}

export async function getDyestuffAmtonHand(dye) {
  try {
    const row = await fetchDyeStuffsRow(dye);
    if (!row) return "dbErr";

    const rowValues = Object.values(row);
    const value = rowValues[3] ?? "";
    return `${value} kgs`; 
  } catch (err) {
    console.error("Failed to fetch chemicals row", err);
    return ""; 
  }
}

export async function getFinishingChemicalsAmtonHand(chemical) {
  try {
    const row = await fetchChemicalsRow(chemical);
    if (!row) return "dbErr";

    const rowValues = Object.values(row);
    const value = rowValues[3] ?? "";

    // console.log(`The amount in hand for ${chemical} is ${value}`);

    return `${value} Ltrs`; 
  } catch (err) {
    console.error("Failed to fetch chemicals row", err);
    return ""; 
  }
}


export async function getChemicalsCostPerLtorKg(chemical) {
  try {
    const row = await fetchChemicalsRow(chemical);
    if (!row) return "dbErr";

    const rowValues = Object.values(row);
    const value = rowValues[6] ?? "";

  

    return `${value} `; 
  } catch (err) {
    console.error("Failed to fetch chemicals row", err);
    return ""; 
  }
}


export async function getDyestuffCostPerLtorKg(dye) {
  try {
    const row = await fetchDyeStuffsRow(dye);
    if (!row) return "dbErr";

    const rowValues = Object.values(row);
    const value = rowValues[6] ?? "";
    return `${value}`; 
  } catch (err) {
    console.error("Failed to fetch chemicals row", err);
    return ""; 
  }
}



// Scouring chemicals total cost
export function getScouringChem1TotalCost(scouringSystem, c8, c48, c60, waterLitresDyeing, g74) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10;

    if (scouringSystem === "Reactive") {
      const total = round1(c8 * waterLitresDyeing) + c60 * waterLitresDyeing;

      if (total >= 1000) {
        return round1(c8 * waterLitresDyeing / 1000) * g74 +
               round1(c60 * waterLitresDyeing / 1000) * g74;
      } else {
        return (round1(c8 * waterLitresDyeing) * g74 / 1000) +
               (round1(c60 * waterLitresDyeing) * g74 / 1000);
      }

    } else if (scouringSystem === "Enzymatic" || scouringSystem === "Chlorine") {
      const val = round1(c8 * waterLitresDyeing);

      if (val >= 1000) {
        return round1(c8 * waterLitresDyeing / 1000) * g74;
      } else {
        return (val * g74) / 1000;
      }

    } else {
      const total = round1(c8 * waterLitresDyeing) + c48 * waterLitresDyeing;

      if (total >= 1000) {
        return round1(c8 * waterLitresDyeing / 1000) * g74 +
               round1(c48 * waterLitresDyeing / 1000) * g74;
      } else {
        return (round1(c8 * waterLitresDyeing) * g74 / 1000) +
               (round1(c48 * waterLitresDyeing) * g74 / 1000);
      }
    }
  } catch (err) {
    return ""; 
  }
}




export function getScouringChem2TotalCost(scouringSystem, c9, c13, c49, waterLitresDyeing, g74, g75) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    if (scouringSystem === "CreamStripe") {
      const total = round1(c9 * waterLitresDyeing + c13 * waterLitresDyeing + c49 * waterLitresDyeing);

      if (total >= 1000) {
        return round1(
          (c9 * waterLitresDyeing / 1000) * g74 +
          (c13 * waterLitresDyeing / 1000) * g74 +
          (c49 * waterLitresDyeing / 1000) * g74
        );
      } else {
        return (
          (round1(c9 * waterLitresDyeing) * g75 / 1000) +
          (round1(c13 * waterLitresDyeing) * g75 / 1000) +
          (round1(c49 * waterLitresDyeing) * g75 / 1000)
        );
      }

    } else {
      const total = round1(c9 * waterLitresDyeing) + c49 * waterLitresDyeing;

      if (total >= 1000) {
        return (
          round1(c9 * waterLitresDyeing / 1000) * g75 +
          round1(c49 * waterLitresDyeing / 1000) * g75
        );
      } else {
        return (
          (round1(c9 * waterLitresDyeing) * g75 / 1000) +
          (round1(c49 * waterLitresDyeing) * g75 / 1000)
        );
      }
    }
  } catch (err) {
    return ""; 
  }
}




export function getScouringChem3TotalCost(scouringSystem, c10, c11, c48, waterLitresDyeing, g76, ) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    if (scouringSystem === "Reactive") {
      const total = round1(c10 * waterLitresDyeing) + c48 * waterLitresDyeing;

      if (total >= 1000) {
        return (
          round1((c10 * waterLitresDyeing) / 1000) * g76 +
          round1((c48 * waterLitresDyeing) / 1000) * g76
        );
      } else {
        return (
          (round1(c10 * waterLitresDyeing) * g76) / 1000 +
          (round1(c48 * waterLitresDyeing) * g76) / 1000
        );
      }

    } else if (scouringSystem === "Enzymatic") {
      if (c10 * waterLitresDyeing >= 1000) {
        return round1((c10 * waterLitresDyeing) / 1000) * g76;
      } else {
        return (round1(c10 * waterLitresDyeing) * g76) / 1000;
      }

    } else {
      if (c11 * waterLitresDyeing >= 1000) {
        return round1((c11 * waterLitresDyeing) / 1000) * g76;
      } else {
        return (round1(c11 * waterLitresDyeing) * g76) / 1000;
      }
    }
  } catch (err) {
    return ''; 
  }
}




export function getScouringChem4TotalCost(scouringSystem, c11, c12, c48, waterLitresDyeing, g77, ) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    if (scouringSystem === "Reactive") {
      // Case 1: Reactive uses only c11
      if (c11 * waterLitresDyeing >= 1000) {
        return round1((c11 * waterLitresDyeing) / 1000) * g77;
      } else {
        return (round1(c11 * waterLitresDyeing) * g77) / 1000;
      }

    } else if (scouringSystem === "Enzymatic") {
      // Case 2: Enzymatic uses c11 + c48
      if (round1(c11 * waterLitresDyeing) + c48 * waterLitresDyeing >= 1000) {
        return (
          round1((c11 * waterLitresDyeing) / 1000) * g77 +
          round1((c48 * waterLitresDyeing) / 1000) * g77
        );
      } else {
        return (
          (round1(c11 * waterLitresDyeing) * g77) / 1000 +
          (round1(c48 * waterLitresDyeing) * g77) / 1000
        );
      }

    } else {
      // Case 3: Other systems use c12
      if (c12 * waterLitresDyeing >= 1000) {
        return round1((c12 * waterLitresDyeing) / 1000) * g77;
      } else {
        return (round1(c12 * waterLitresDyeing) * g77) / 1000;
      }
    }
  } catch (err) {
    return ""; 
  }
}


export function getScouringChem5TotalCost(scouringSystem, c12, waterLitresDyeing, g78, ) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    if (scouringSystem === "Reactive") {
      if (c12 * waterLitresDyeing >= 1000) {
        return round1((c12 * waterLitresDyeing) / 1000) * g78;
      } else {
        return (round1(c12 * waterLitresDyeing) * g78) / 1000;
      }
    }

    return ""; 
  } catch (err) {
    return ""; 
  }
}

export function getScouringChem6TotalCost(scouringSystem, c13, waterLitresDyeing, g79, ) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    if (scouringSystem === "Reactive") {
      if (c13 * waterLitresDyeing >= 1000) {
        return round1((c13 * waterLitresDyeing) / 1000) * g79;
      } else {
        return (round1(c13 * waterLitresDyeing) * g79) / 1000;
      }
    }

    return ''; 
  } catch (err) {
    return ""; 
  }
}


export function getPrepareToDyeChem1TotalCost(c21, c59, waterLitresDyeing, g81) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    const total = round1(c21 * waterLitresDyeing) + c59 * waterLitresDyeing;

    if (total >= 1000) {
      return round1((c21 * waterLitresDyeing) / 1000) * g81 +
             round1((c59 * waterLitresDyeing) / 1000) * g81;
    } else {
      return (round1(c21 * waterLitresDyeing) * g81) / 1000 +
             (round1(c59 * waterLitresDyeing) * g81) / 1000;
    }
  } catch (err) {
    return ""; 
  }
}


export function getPrepareToDyeChem2TotalCost(c22, waterLitresDyeing, g82) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    const total = round1(c22 * waterLitresDyeing);

    if (total >= 1000) {
      return round1((c22 * waterLitresDyeing) / 1000) * g82;
    } else {
      return (round1(c22 * waterLitresDyeing) * g82) / 1000;
    }
  } catch (err) {
    return ""; 
  }
}

export function getPrepareToDyeChem3TotalCost(c25, waterLitresDyeing, g83) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    const total = round1(c25 * waterLitresDyeing);

    if (total >= 1000) {
      return round1((c25 * waterLitresDyeing) / 1000) * g83;
    } else {
      return (round1(c25 * waterLitresDyeing) * g83) / 1000;
    }
  } catch (err) {
    return "";
  }
}


export function getPrepareToDyeChem4TotalCost(
  c26, c34, waterLitresDyeing, g84, colourSelected, scouringSystemSelected
) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10;

    // Case 1: Colour special conditions
    if (
      colourSelected === "Blue - Memorial-Bubanks-HEGN" ||
      colourSelected === "Blue - Memorial-Brenntag-HEGN"
    ) {
      if (c34 * waterLitresDyeing >= 1000) {
        return round1((c34 * waterLitresDyeing) / 1000) * g84;
      } else {
        return (round1(c34 * waterLitresDyeing) * g84) / 1000;
      }
    }

    // Case 2: Scouring = CreamStripe
    if (scouringSystemSelected === "CreamStripe") {
      if (c34 * waterLitresDyeing >= 1000) {
        return round1((c34 * waterLitresDyeing) / 1000) * g84;
      } else {
        return (round1(c26 * waterLitresDyeing) * g84) / 1000;
      }
    }

    // Case 3: Default (uses C26)
    if (c26 * waterLitresDyeing >= 1000) {
      return round1((c26 * waterLitresDyeing) / 1000) * g84;
    } else {
      return (round1(c26 * waterLitresDyeing) * g84) / 1000;
    }
  } catch (err) {
    return ""; 
  }
}


export function getDyestuffTotalCost(cValue, quantityKgsDyeing, gValue) {
  try {
    
    const dyePercent = cValue / 100;
    const result = dyePercent * quantityKgsDyeing * gValue;

    
    return Math.round(result * 100) / 100;
  } catch (err) {
    return ""; 
  }
}



export function getDyestuff5TotalCost(c26, c34, waterLitresDyeing, g92, saltPosition) {
  try {
    const round1 = (val) => Math.round(val * 10) / 10; 

    if (saltPosition === "Before Dyes") {
      if (c26 * waterLitresDyeing >= 1000) {
        return round1((c26 * waterLitresDyeing) / 1000) * g92;
      } else {
        return (round1(c26 * waterLitresDyeing) * g92) / 1000;
      }
    } else {
      if (c34 * waterLitresDyeing >= 1000) {
        return round1((c34 * waterLitresDyeing) / 1000) * g92;
      } else {
        return (round1(c34 * waterLitresDyeing) * g92) / 1000;
      }
    }
  } catch (err) {
    return 0; 
  }
}


export function getFinishingChemicalTotalCost(cValue, waterLitresDyeing, gValue) {
  try {
    const base = cValue * waterLitresDyeing;
    let result;

    if (Math.round(base) >= 1000) {
      result = Math.round((base / 1000) * gValue * 10) / 10; 
    } else {
      result = Math.round(base * gValue / 1000 * 10) / 10;
    }

    
    return (Math.round(result * 100) / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (err) {
    return ""; 
  }
}

export function getWaterUsedTotalCost(
  g97,
  d65,
  d62,
  d58,
  d54,
  d20,
  d16,
  waterLitresDyeing
) {
  try {
    const sum =
      d65 + d62 + d58 + d54 + d20 + d16 + waterLitresDyeing;

    const result = Math.round(g97 * sum);

    
    return result.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return "";
  }
}






export function getChemSummary(kgsNeeded, amtInHand) {
  try {
    
    const resolve = (v) => (typeof v === "function" ? v() : v);

    const neededRaw = resolve(kgsNeeded);
    const handRaw = resolve(amtInHand);

    if (!neededRaw || !handRaw) return "";
    const parseValueUnit = (input) => {
      const s = String(input).trim();
      const [valStr, ...unitParts] = s.split(/\s+/);
      const unit = (unitParts.join("") || "").toLowerCase();
      const numeric = parseFloat(valStr.replace(/,/g, "")); 
      return { numeric, unit };
    };

    const needed = parseValueUnit(neededRaw);
    const hand = parseValueUnit(handRaw);

    if (isNaN(needed.numeric) || isNaN(hand.numeric)) {
       return "E";
    }

    
    let neededValue = needed.numeric;
    if (needed.unit === "g" || needed.unit === "gms") {
      neededValue = needed.numeric / 1000;
    } else if (!needed.unit) {
      neededValue = needed.numeric;
    } 

    const handValue = hand.numeric;

    const result = neededValue <= handValue ? "Ok" : "Shortfall";

    return result;
  } catch (err) {
   
    return "E";
  }
}

export function getNeededTotal(summary, value) {
  try {
    if (summary === "Shortfall") {
      const numericValue = Number(String(value).replace(/,/g, ""));

      // If invalid or zero, return empty
      if (!numericValue) return "";

      // Round to the nearest whole number
      const rounded = Math.round(numericValue);

      // Always show .00
      return rounded.toFixed(2);
    }
    return "";
  } catch {
    return "";
  }
}








