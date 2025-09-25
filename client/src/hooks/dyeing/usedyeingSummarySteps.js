import { useMemo } from "react";
import useDyeingStore from "../../store/zustand";
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
} from "../../utils/constants";
import {
  computeAmount,
  getDyeingTemp,
  getDyeingPh,
  getDyeingTime,
  getChemicalField,
  computeDyeingSaltAmount,
  getSaltGramsPerL,
  getSaltDynamicTemp,
  getSaltDynamicDuration,
  getRemainInDwell,
  computeStartingWaterAmount,
  getScouringTemp,
  getScouringTime,
  getScouringPH,
  getScouringChemical1,
  getScouringChemical2,
  getScouringChemical3,
  getScouringChemical4,
  getScouringChemical5,
  getScouringChemical7,
  getScouringChemical6,
  getScouringPL,
  getScouringChemicalAmount,
  getgramsPLForHotwash,
  getHotWashTitle1,
  getHotWashTitle2,
  computeRoundedWater80,
  computeHotwashAmount,
  getHotwashTemp,
  getHotwashDuration,
  getHotwashPh,
  getPrepareToDyeTitle1,
  getPrepareToDyeTitle2,
  getPrepareToDyeTitle3,
  getPrepareToDyeGPL1,
  getPrepareToDyeGPL2,
  getPrepareToDyeGPL3,
  getPrepareToDyeAmt,
  getPrepareToDyeAmt1,
  getPrepareToDyeTemp,
  getPrepareToDyeProperty,
  step4sec1Chemical1,
  step4sec1Chemical2,
  step4sec1ChemicalGpl,
  getEndChemical1,
  getEndChemicalAmount,
  getFirstRinseChem1,
  roundupWater,
  getSoapingChem1,
  getFirstRinseChem2,
  getFirstRinseChem3,
  getSoapingChemAmt,
  getFinalRinseChem1,
  getFinishingChem1,
  getFinishingChem2,
  getFinishingChem3,
  getFinishingChemAmt,
  totalWaterUsed,
} from "../../components/functions/dyeingfunc";
 

import useScouringData from "./useScouringData";
import useHotwashData from "./useHotwashData";
import usePrepareToDyeData from "./usePrepareToDyeData";
import useDyeingData from "./useDyeingData";
import { getDyeingSec1ChemAmt1, getDyeingSec1ChemAmt2,  } from "../../components/functions/dyeingFunctions";
import useEndData from "./useEndData";
import useFirstRinseData from "./useFirstRinseData";
import useSoapingData from "./useSoapingData";
import useFinalRinseData from "./useFinalRinseSteps";
import useFinishingData from "./useFinishingSteps";
import {  getChemSummary, getDyeingChem1KgsNeeded,  getDyeingChem2KgsNeeded,  getDyeingChem3KgsNeeded, getDyeingChem4, 
  getDyeingChem4KgsNeeded, getDyeingChem5, getDyeingChem5KgsNeeded, getDyestuff5TotalCost, getDyestuffTotalCost, getFinishingChem1KgsNeeded, 
  getFinishingChem2KgsNeeded, getFinishingChemicalTotalCost, getKgsNeededScouringChem1, getKgsNeededScouringChem2, 
  getKgsNeededScouringChem3, getKgsNeededScouringChem4, getKgsNeededScouringChem5, getKgsNeededScouringChem6, 
  getNeededTotal, 
  getprepareToDyeChem1KgsNeeded, getPrepareToDyeChem1TotalCost, getprepareToDyeChem2KgsNeeded, getPrepareToDyeChem2TotalCost, getprepareToDyeChem3KgsNeeded, 
  getPrepareToDyeChem3TotalCost, 
  getprepareToDyeChem4KgsNeeded, getPrepareToDyeChem4TotalCost, getPrepareToDyeSummaryChem, getScouringChem1TotalCost, getScouringChem2TotalCost, getScouringChem3TotalCost, getScouringChem4TotalCost, getScouringChem5TotalCost, getScouringChem6TotalCost, getScouringSummaryChem, getScouringSummaryChem3, 
  getScouringSummaryChem4, 
  getWaterUsedTotalCost, 
  } from "../../components/functions/dyeingSummaryFunctions";
import useChemicalsinHandData from "./usedyeingSummaryData";

export default function usedyeingSummarySteps() {
  const {
    winch,
    scouring,
    saltOption,
    selectedColour,
    saltPosition,
    liqRatio,
    lotWeight,
    dyeingSystem,
    soaping,
    softener,
    liqRatio8
  } = useDyeingStore();


  function prepareRows(rows) {
  const drainRows = rows.filter(r => r.ph === "Drain");
  const normalRows = rows.filter(r => r.ph !== "Drain" && r.ph !== "");

  if (normalRows.length === 0) return rows;

  // give rowSpan to first normal row
  normalRows[0]._phRowSpan = normalRows.length; 

  // clear ph from the rest
  for (let i = 1; i < normalRows.length; i++) {
    normalRows[i].ph = "";
  }

  return [...normalRows, ...drainRows];
}

  const selectedIndex = useMemo(() => {
        if (!selectedColour) return -1;
        return Colour_Chart.findIndex(
          (color) =>
            typeof color === "string" &&
            typeof selectedColour === "string" &&
            color.trim() === selectedColour.trim()
        );
      }, [selectedColour]);

      const getNameAt = (arr) =>
        selectedIndex === -1 ? "" : arr?.[selectedIndex] ?? "";
      const getAmtAt = (arr) => {
        if (selectedIndex === -1) return "";
        const v = arr?.[selectedIndex];
        return v ?? "";
      };
      const formatNumber = (val) => {
        if (val === "" || val === null || val === undefined) return "";
        const n = Number(val);
        if (Number.isNaN(n)) return String(val);
        return n.toFixed(3);
      };

const b26Title = step4sec1Chemical2({saltPosition, saltOption, scouring, });
 const saltOptionstep4 = getChemicalField({  saltPosition, saltOption, scouring, dyeingSystem, selectedColour,});

//Fetch Data from the SQL server
 const { values: scouringValues, scouringTemp, scouringTime, scouringPH,hotwashGpl } = useScouringData(scouring, selectedColour, dyeingSystem);

//  fetch hotrwash data
 const { hotwashTemp, hotwashTime, hotwashPH, } = useHotwashData(selectedColour, dyeingSystem);

//  fetch prepare to dye data
 const { prepareToDyeChem1Gpl, prepareToDyeChem2Gpl,prepareToDyeChem3Gpl, 
  prepareToDyeTime, prepareToDyePh, prepareToDyeTemp} = usePrepareToDyeData(selectedColour, dyeingSystem, scouring);
 
//  fetch dyeing data
  const { dyeingSec1Chem1Gpl, dyeingSec1Chem2Gpl, dyeingSec1Temp, dyeingSec1Ph, dyeingSec1Duration, 
  dyeingSec2Gpl1,dyeingSec2Gpl2,dyeingSec2Gpl3,dyeingSec2Gpl4,dyeingSec2Gpl5, dyeingSec2Temp1, dyeingSec2Temp2,
  dyeingSec2Time1,dyeingSec2Time2, dyeingSec2Ph
 } = useDyeingData(selectedColour,  scouring, b26Title, dyeingSystem,saltOptionstep4,saltOption);

//  end step- dyeing
  const { endGpl1, endGpl2, endTemp, endDuration, endPh } = useEndData(scouring, selectedColour, dyeingSystem)

  //fetch first rinse dta
  const { firstRinseTemp, firstRinsePh, firstRinseDuration} = useFirstRinseData(scouring, selectedColour, dyeingSystem)

 //fetch soaping dta
  const { soapingGpl1, soapingGpl2,soapingTemp,soapingDuration ,soapingPh } = useSoapingData(scouring, selectedColour, dyeingSystem) 

 //fetch final Rinse dta
  const { finalRinseTemp,finalRinseDuration ,finalRinsePh } = useFinalRinseData(scouring, selectedColour,)

 //fetch finishing Rinse dta
  const {   finishingGpl1,   finishingGpl2,  finishingTemp, finishingDuration, finishingPh  } = useFinishingData(scouring, selectedColour, softener, liqRatio8,)  
  
 

  
  


  const NBSP = "\u00A0";
  //scouring chemicals
  const scouringChemical1 = getScouringChemical1({ scouringSystem: scouring });
  const scouringChemical2 = getScouringChemical2({ scouringSystem: scouring });
  const scouringChemical3 = getScouringChemical3({ scouringSystem: scouring });
  const scouringChemical4 = getScouringSummaryChem3(scouring );
  const scouringChemical5 = getScouringSummaryChem(scouring, 6, 5);
  const scouringChemical6 = getScouringSummaryChem(scouring, 8, 6);
  const scouringChemical7 = getScouringSummaryChem(scouring, 8, 7);


  

  // preparetodye chemicals

const prepareToDyechem1 = getPrepareToDyeSummaryChem(scouring, 3);
const prepareToDyechem2 = getPrepareToDyeSummaryChem(scouring, 2);
const prepareToDyechem3 = getPrepareToDyeSummaryChem(scouring, 4);
const prepareToDyechem4 = getDyeingChem4(scouring, saltPosition, saltOption);

  // dyeing chemicals

const dyeingchem1 = getNameAt(Dyestuff_1);
const dyeingchem2 = getNameAt(Dyestuff_2);
const dyeingchem3 = getNameAt(Dyestuff_3);
const dyeingchem4 = getNameAt(Dyestuff_4);
const dyeingchem5 = getDyeingChem5(scouring, saltPosition, saltOption);

  // finishing chemicals

const finishingchem1 = getFinishingChem2(scouring, softener);
const finishingchem2 = getFinishingChem3(scouring, liqRatio8);




 
  
  const waterLitresDyeing = computeStartingWaterAmount({lotWeight,liqRatio,winch, });
  const gpl = getPrepareToDyeGPL1(dyeingSystem, selectedColour);
  const dwellValue = getRemainInDwell({saltPosition,scouringSystemSelected: scouring,selectedColour, });
  
  const c8 = scouringValues[2];
  const c48 = endGpl1 ;
  const c60 = soapingGpl2;
  const c66 = finishingGpl1;
  const c67 = finishingGpl2;
  const totalWaterLtrsUsed = totalWaterUsed({waterLitresDyeing, gpl, dyeingSystem,lotWeight,liqRatio,  winch});  

  const c9 = scouringValues[3];
  const c13 = scouringValues[7]; 
  const c49 = endGpl2 ;

  const c10 = scouringValues[4];
  const c11 = scouringValues[5];
  const c12 = scouringValues[6];

  // c21, c59, c22, c25,
   const c21 = prepareToDyeChem2Gpl;
   const c22 = prepareToDyeChem3Gpl;
  const c59 = soapingGpl1;
  const c25 = dyeingSec1Chem1Gpl;
  const c26 = dyeingSec1Chem2Gpl;
  const c34 = dyeingSec2Gpl5;

  // c29, c30, c31, c32, 
  const c29 = dyeingSec2Gpl1;
  const c30 = dyeingSec2Gpl2;
  const c31 = dyeingSec2Gpl3;
  const c32 = dyeingSec2Gpl4;
  const c33 = dyeingSec2Gpl4;


  const d65 = roundupWater(waterLitresDyeing);
  const d62 = roundupWater(waterLitresDyeing);
  const d58 = roundupWater(waterLitresDyeing);
  const d54 = roundupWater(waterLitresDyeing);
  const d20 = roundupWater(waterLitresDyeing);
  const d16 = roundupWater(waterLitresDyeing);
 
 
  

   const {   chem1AmtinHand,
    chem2AmtinHand,
    chem3AmtinHand,
    chem4AmtinHand,
    chem5AmtinHand,
    chem6AmtinHand,
    chem7AmtinHand,
    chem8AmtinHand,
    chem9AmtinHand,
    chem10AmtinHand,
    dye1AmtinHand,
    dye2AmtinHand,
    dye3AmtinHand,
    dye4AmtinHand,
    dye5AmtinHand,
    finishingChem1AmtinHand,
    finishingChem2AmtinHand,
    finishingChem3AmtinHand,
      // costs
    chem1Cost, chem2Cost, chem3Cost, chem4Cost, chem5Cost, 
    chem6Cost, chem7Cost, chem8Cost, chem9Cost, chem10Cost,
    dye1Cost, dye2Cost, dye3Cost, dye4Cost,
    dye5Cost, 
    finishingChem1Cost, finishingChem2Cost, finishingChem3Cost,
    } = useChemicalsinHandData(
  scouringChemical2, scouringChemical3, scouringChemical4, scouringChemical5, scouringChemical6,
  scouringChemical7, prepareToDyechem1, prepareToDyechem2, prepareToDyechem3, prepareToDyechem4, dyeingchem1,
  dyeingchem2,dyeingchem3,dyeingchem4,dyeingchem5,finishingchem1,finishingchem2, "Water",
)  

   const g74 = chem1Cost
   const g75 = chem2Cost
   const g76 = chem3Cost
   const g77 = chem4Cost
   const g78 = chem5Cost
   const g79 = chem6Cost

   const g81 = chem7Cost
   const g82 = chem8Cost
   const g83 = chem9Cost
   const g84 = chem10Cost

   const g88 = dye1Cost
   const g89 = dye2Cost
   const g90 = dye3Cost
   const g91 = dye4Cost
   const g92 = dye5Cost
   const g94 = finishingChem1Cost
   const g95 = finishingChem2Cost
   const g97 = finishingChem3Cost

//helper functions
function formatCost(value) {
  if (!value || isNaN(value) || value === 0) return '';
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}





const scouringChem1TotalCost = formatCost(
  getScouringChem1TotalCost(scouring, c8, c48, c60, waterLitresDyeing, g74)
);

const scouringChem2TotalCost = formatCost(
  getScouringChem2TotalCost(scouring, c9, c13, c49, waterLitresDyeing, g74, g75)
);

const scouringChem3TotalCost = formatCost(
  getScouringChem3TotalCost(scouring, c10, c11, c48, waterLitresDyeing, g76)
);

const scouringChem4TotalCost = formatCost(
  getScouringChem4TotalCost(scouring, c11, c12, c48, waterLitresDyeing, g77)
);

const scouringChem5TotalCost = formatCost(
  getScouringChem5TotalCost(scouring, c12, waterLitresDyeing, g78)
);

const scouringChem6TotalCost = formatCost(
  getScouringChem6TotalCost(scouring, c13, waterLitresDyeing, g79)
);

// --- Prepare to dye ---
const prepareTodyeChem1TotalCost = formatCost(
  getPrepareToDyeChem1TotalCost(c21, c59, waterLitresDyeing, g81)
);

const prepareTodyeChem2TotalCost = formatCost(
  getPrepareToDyeChem2TotalCost(c22, waterLitresDyeing, g82)
);

const prepareTodyeChem3TotalCost = formatCost(
  getPrepareToDyeChem3TotalCost(c25, waterLitresDyeing, g83)
);

const prepareTodyeChem4TotalCost = formatCost(
  getPrepareToDyeChem4TotalCost(c26, c34, waterLitresDyeing, g84, selectedColour, scouring)
);
 

const dyestuff1TotalCost = formatCost(getDyestuffTotalCost(c29, lotWeight, g88));
const dyestuff2TotalCost = formatCost(getDyestuffTotalCost(c30, lotWeight, g89));
const dyestuff3TotalCost = formatCost(getDyestuffTotalCost(c31, lotWeight, g90));
const dyestuff4TotalCost = formatCost(getDyestuffTotalCost(c33, lotWeight, g91));
const dyestuff5TotalCost = formatCost(getDyestuff5TotalCost(c26, c34, waterLitresDyeing, g92, saltPosition));
   

const finishingChem1TotalCost = getFinishingChemicalTotalCost(c66, waterLitresDyeing, g94);
const finishingChem2TotalCost = getFinishingChemicalTotalCost(c67, waterLitresDyeing, g95);

const kgsNeededScouringChem1 = getKgsNeededScouringChem1(scouring,waterLitresDyeing, c8,  c48, c60,)
const kgsNeededScouringChem2 = getKgsNeededScouringChem2(scouring,waterLitresDyeing,c9,c13,c49)
const kgsNeededScouringChem3 = getKgsNeededScouringChem3(scouring,waterLitresDyeing,  c10,c11,  c48)
const kgsNeededScouringChem4 = getKgsNeededScouringChem4(scouring, waterLitresDyeing,c8, c11,  c48)
const kgsNeededScouringChem5 = getKgsNeededScouringChem5(scouring, waterLitresDyeing, c12)
const kgsNeededScouringChem6 = getKgsNeededScouringChem6(scouring, waterLitresDyeing, c13)



// Scouring summaries
const scouringSummary1 = getChemSummary(kgsNeededScouringChem1, chem1AmtinHand);
const scouringSummary2 = getChemSummary(kgsNeededScouringChem2, chem2AmtinHand);
const scouringSummary3 = getChemSummary(kgsNeededScouringChem3, chem3AmtinHand);
const scouringSummary4 = getChemSummary(kgsNeededScouringChem4, chem4AmtinHand);
const scouringSummary5 = getChemSummary(kgsNeededScouringChem5, chem5AmtinHand);
const scouringSummary6 = getChemSummary(kgsNeededScouringChem6, chem6AmtinHand);

// Prepare To Dye summaries
const prepareToDyeSummary1 = getChemSummary(getprepareToDyeChem1KgsNeeded(waterLitresDyeing, c21, c59), chem7AmtinHand);
const prepareToDyeSummary2 = getChemSummary(getprepareToDyeChem2KgsNeeded(waterLitresDyeing, c22), chem8AmtinHand);
const prepareToDyeSummary3 = getChemSummary(getprepareToDyeChem3KgsNeeded(waterLitresDyeing, c25), chem9AmtinHand);
const prepareToDyeSummary4 = getChemSummary(getprepareToDyeChem4KgsNeeded(waterLitresDyeing, c26, c34, saltPosition, scouring), chem10AmtinHand);

// Dyeing summaries
const dyeingSummary1 = getChemSummary(getDyeingChem1KgsNeeded(lotWeight, c29), dye1AmtinHand);
const dyeingSummary2 = getChemSummary(getDyeingChem2KgsNeeded(lotWeight, c30), dye2AmtinHand);
const dyeingSummary3 = getChemSummary(getDyeingChem3KgsNeeded(lotWeight, c31), dye3AmtinHand);
const dyeingSummary4 = getChemSummary(getDyeingChem4KgsNeeded(lotWeight, c32), dye4AmtinHand);
const dyeingSummary5 = getChemSummary(getDyeingChem5KgsNeeded(lotWeight, waterLitresDyeing, c34, saltPosition, scouring), dye5AmtinHand);

// Finishing summaries
const finishingSummary1 = getChemSummary(getFinishingChem1KgsNeeded(waterLitresDyeing, c66), finishingChem1AmtinHand);
const finishingSummary2 = getChemSummary(getFinishingChem2KgsNeeded(waterLitresDyeing, c25, liqRatio8), finishingChem2AmtinHand);
const finishingSummary3 = ""; 
const finishingSummary4 = getChemSummary(totalWaterLtrsUsed, finishingChem3AmtinHand);






 
  return [
     {
    step: "Scouring",
    rows: [
      {
        chemical: scouringChemical2,
        kgs_needed: kgsNeededScouringChem1,
        amt_on_hand: chem1AmtinHand ?? "fetching data..",
        summary: scouringSummary1,
        cost_per_kg: chem1Cost ?? "fetching data..",
        total_cost: scouringChem1TotalCost,
        needed_totals: getNeededTotal(scouringSummary1, scouringChem1TotalCost),
      },
      {
        chemical: scouringChemical3,
        kgs_needed: getKgsNeededScouringChem2(scouring, waterLitresDyeing, c9, c13, c49),
        amt_on_hand: chem2AmtinHand ?? "",
        summary: scouringSummary2,
        cost_per_kg: chem2Cost ?? "",
        total_cost: scouringChem2TotalCost,
        needed_totals: getNeededTotal(scouringSummary2, scouringChem2TotalCost),
      },
      {
        chemical: scouringChemical4,
        kgs_needed: getKgsNeededScouringChem3(scouring, waterLitresDyeing, c10, c11, c48),
        amt_on_hand: chem3AmtinHand ?? "",
        summary: scouringSummary3,
        cost_per_kg: chem3Cost ?? "",
        total_cost: scouringChem3TotalCost,
        needed_totals: getNeededTotal(scouringSummary3, scouringChem3TotalCost),
      },
      {
        chemical: scouringChemical5,
        kgs_needed: getKgsNeededScouringChem4(scouring, waterLitresDyeing, c8, c11, c48),
        amt_on_hand: chem4AmtinHand ?? "",
        summary: scouringSummary4,
        cost_per_kg: chem4Cost ?? "",
        total_cost: scouringChem4TotalCost,
        needed_totals: getNeededTotal(scouringSummary4, scouringChem4TotalCost),
      },
      {
        chemical: scouringChemical6,
        kgs_needed: getKgsNeededScouringChem5(scouring, waterLitresDyeing, c12),
        amt_on_hand: chem5AmtinHand ?? "",
        summary: scouringSummary5,
        cost_per_kg: chem5Cost ?? "",
        total_cost: scouringChem5TotalCost,
        needed_totals: getNeededTotal(scouringSummary5, scouringChem5TotalCost),
      },
      {
        chemical: scouringChemical7,
        kgs_needed: getKgsNeededScouringChem6(scouring, waterLitresDyeing, c13),
        amt_on_hand: chem6AmtinHand ?? "",
        summary: scouringSummary6,
        cost_per_kg: chem6Cost ?? "",
        total_cost: scouringChem6TotalCost,
        needed_totals: getNeededTotal(scouringSummary6, scouringChem6TotalCost),
      },
    ],
  },
  {
    step: "Prepare To Dye",
    rows: [
      {
        chemical: prepareToDyechem1,
        kgs_needed: getprepareToDyeChem1KgsNeeded(waterLitresDyeing, c21, c59),
        amt_on_hand: chem7AmtinHand ?? "fetching data..",
        summary: prepareToDyeSummary1,
        cost_per_kg: chem7Cost ?? "fetching data..",
        total_cost: prepareTodyeChem1TotalCost,
        needed_totals: getNeededTotal(prepareToDyeSummary1, prepareTodyeChem1TotalCost),
      },
      {
        chemical: prepareToDyechem2,
        kgs_needed: getprepareToDyeChem2KgsNeeded(waterLitresDyeing, c22),
        amt_on_hand: chem8AmtinHand ?? "",
        summary: prepareToDyeSummary2,
        cost_per_kg: chem8Cost ?? "",
        total_cost: prepareTodyeChem2TotalCost,
        needed_totals: getNeededTotal(prepareToDyeSummary2, prepareTodyeChem2TotalCost),
      },
      {
        chemical: prepareToDyechem3,
        kgs_needed: getprepareToDyeChem3KgsNeeded(waterLitresDyeing, c25),
        amt_on_hand: chem9AmtinHand ?? "",
        summary: prepareToDyeSummary3,
        cost_per_kg: chem9Cost ?? "",
        total_cost: prepareTodyeChem3TotalCost,
        needed_totals: getNeededTotal(prepareToDyeSummary3, prepareTodyeChem3TotalCost),
      },
      {
        chemical: prepareToDyechem4,
        kgs_needed: getprepareToDyeChem4KgsNeeded(waterLitresDyeing, c26, c34, saltPosition, scouring),
        amt_on_hand: chem10AmtinHand ?? "",
        summary: prepareToDyeSummary4,
        cost_per_kg: chem10Cost ?? "",
        total_cost: prepareTodyeChem4TotalCost,
        needed_totals: getNeededTotal(prepareToDyeSummary4, prepareTodyeChem4TotalCost),
      },
    ],
  },
  {
    step: "Dyeing",
    rows: [
      {
        chemical: dyeingchem1,
        kgs_needed: getDyeingChem1KgsNeeded(lotWeight, c29),
        amt_on_hand: dye1AmtinHand ?? "fetching data..",
        summary: dyeingSummary1,
        cost_per_kg: dye1Cost ?? "fetching data..",
        total_cost: dyestuff1TotalCost,
        needed_totals: getNeededTotal(dyeingSummary1, dyestuff1TotalCost),
      },
      {
        chemical: dyeingchem2,
        kgs_needed: getDyeingChem2KgsNeeded(lotWeight, c30),
        amt_on_hand: dye2AmtinHand ?? "",
        summary: dyeingSummary2,
        cost_per_kg: dye2Cost ?? "",
        total_cost: dyestuff2TotalCost,
        needed_totals: getNeededTotal(dyeingSummary2, dyestuff2TotalCost),
      },
      {
        chemical: dyeingchem3,
        kgs_needed: getDyeingChem3KgsNeeded(lotWeight, c31),
        amt_on_hand: dye3AmtinHand ?? "",
        summary: dyeingSummary3,
        cost_per_kg: dye3Cost ?? "",
        total_cost: dyestuff3TotalCost,
        needed_totals: getNeededTotal(dyeingSummary3, dyestuff3TotalCost),
      },
      {
        chemical: dyeingchem4,
        kgs_needed: getDyeingChem4KgsNeeded(lotWeight, c32),
        amt_on_hand: dye4AmtinHand ?? "",
        summary: dyeingSummary4,
        cost_per_kg: dye4Cost ?? "",
        total_cost: dyestuff4TotalCost,
        needed_totals: getNeededTotal(dyeingSummary4, dyestuff4TotalCost),
      },
      {
        chemical: dyeingchem5,
        kgs_needed: getDyeingChem5KgsNeeded(lotWeight, waterLitresDyeing, c34, saltPosition, scouring),
        amt_on_hand: dye5AmtinHand ?? "",
        summary: dyeingSummary5,
        cost_per_kg: dye5Cost ?? "",
        total_cost: dyestuff5TotalCost,
        needed_totals: getNeededTotal(dyeingSummary5, dyestuff5TotalCost),
      },
    ],
  },
  {
    step: "Finishing",
    rows: [
      {
        chemical: finishingchem1,
        kgs_needed: getFinishingChem1KgsNeeded(waterLitresDyeing, c66),
        amt_on_hand: finishingChem1AmtinHand ?? "fetching data..",
        summary: finishingSummary1,
        cost_per_kg: finishingChem1Cost ?? "fetching data..",
        total_cost: finishingChem1TotalCost,
        needed_totals: getNeededTotal(finishingSummary1, finishingChem1TotalCost),
      },
      {
        chemical: finishingchem2,
        kgs_needed: getFinishingChem2KgsNeeded(waterLitresDyeing, c25, liqRatio8),
        amt_on_hand: finishingChem2AmtinHand ?? "",
        summary: finishingSummary2,
        cost_per_kg: finishingChem2Cost ?? "",
        total_cost: finishingChem2TotalCost,
        needed_totals: getNeededTotal(finishingSummary2, finishingChem2TotalCost),
      },
      {
        chemical: "",
        kgs_needed: "",
        amt_on_hand: "",
        summary: finishingSummary3,
        cost_per_kg: "",
        total_cost: "",
        needed_totals: "",
      },
      {
        chemical: "Water",
        kgs_needed: totalWaterLtrsUsed,
        amt_on_hand: finishingChem3AmtinHand ?? "",
        summary: finishingSummary4,
        cost_per_kg: finishingChem3Cost ?? "",
        total_cost: getWaterUsedTotalCost(g97, d65, d62, d58, d54, d20, d16, waterLitresDyeing),
        needed_totals: getNeededTotal(finishingSummary4, getWaterUsedTotalCost(g97, d65, d62, d58, d54, d20, d16, waterLitresDyeing)),
      },
      {
        chemical: "",
        kgs_needed: "",
        amt_on_hand: "",
        summary: "",
        cost_per_kg: "",
        total_cost: "",
        needed_totals: "",
      },
    ],
  },

        
  ];




}
