import { useMemo } from "react";
import useDyeingStore from "../store/zustand";
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
} from "../utils/constants";
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
} from "../components/functions/dyeingfunc";

import useScouringData from "./useScouringData";
import useHotwashData from "./useHotwashData";
import usePrepareToDyeData from "./usePrepareToDyeData";
import useDyeingData from "./useDyeingData";
import { getDyeingSec1ChemAmt1, getDyeingSec1ChemAmt2,  } from "../components/functions/dyeingFunctions";
import useEndData from "./useEndData";
import useFirstRinseData from "./useFirstRinseData";
import useSoapingData from "./useSoapingData";
import useFinalRinseData from "./useFinalRinseSteps";
import useFinishingData from "./useFinishingSteps";
import {  getDyeingChem1KgsNeeded,  getDyeingChem2KgsNeeded,  getDyeingChem3KgsNeeded, getDyeingChem4, 
  getDyeingChem4KgsNeeded, getDyeingChem5, getDyeingChem5KgsNeeded, getFinishingChem1KgsNeeded, getFinishingChem2KgsNeeded, getKgsNeededScouringChem1, getKgsNeededScouringChem2, 
  getKgsNeededScouringChem3, getKgsNeededScouringChem4, getKgsNeededScouringChem5, getKgsNeededScouringChem6, 
  getprepareToDyeChem1KgsNeeded, getprepareToDyeChem2KgsNeeded, getprepareToDyeChem3KgsNeeded, 
  getprepareToDyeChem4KgsNeeded, getPrepareToDyeSummaryChem, getScouringSummaryChem, getScouringSummaryChem3, 
  getScouringSummaryChem4 } from "../components/functions/dyeingSummaryFunctions";

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
 
  

  
 
 
  
  


   








 
  return [
     {
          step: "Scouring",
          rows: [
            {
              chemical: scouringChemical2,
              kgs_needed: getKgsNeededScouringChem1(scouring,waterLitresDyeing, c8,  c48, c60,),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: scouringChemical3,
              kgs_needed: getKgsNeededScouringChem2(scouring,waterLitresDyeing,c9,c13,c49),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: scouringChemical4,
              kgs_needed: getKgsNeededScouringChem3(scouring,waterLitresDyeing,  c10,c11,  c48),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: scouringChemical5,
              kgs_needed: getKgsNeededScouringChem4(scouring, waterLitresDyeing,c8, c11,  c48),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: scouringChemical6,
              kgs_needed: getKgsNeededScouringChem5(scouring, waterLitresDyeing, c12),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: scouringChemical7,
              kgs_needed: getKgsNeededScouringChem6(scouring, waterLitresDyeing, c13),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            
          ],
        },
     {
          step: "Prepare To Dye",
          rows: [
            {
              chemical: prepareToDyechem1,
              kgs_needed: getprepareToDyeChem1KgsNeeded(waterLitresDyeing, c21, c59),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: prepareToDyechem2,
              kgs_needed: getprepareToDyeChem2KgsNeeded(waterLitresDyeing, c22),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: prepareToDyechem3,
              kgs_needed: getprepareToDyeChem3KgsNeeded(waterLitresDyeing, c25),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: prepareToDyechem4,
              kgs_needed: getprepareToDyeChem4KgsNeeded(waterLitresDyeing, c26, c34, saltPosition, scouring),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            
          ],
        },
     {
          step: "Dyeing",
          instructions:
            "ONGEZA ACID KWANZA ALAFU BAADA YA DAKIKA KUMI ONGEZA PEROXIDE KILLER",
          rows: [
            {
              chemical: dyeingchem1,
              kgs_needed: getDyeingChem1KgsNeeded(lotWeight, c29),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: dyeingchem2,
              kgs_needed: getDyeingChem2KgsNeeded(lotWeight, c30),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: dyeingchem3,
              kgs_needed: getDyeingChem3KgsNeeded(lotWeight, c31),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: dyeingchem4,
              kgs_needed: getDyeingChem4KgsNeeded(lotWeight, c32),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: dyeingchem5,
              kgs_needed: getDyeingChem5KgsNeeded(lotWeight, waterLitresDyeing, c34, saltPosition, scouring),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            
          ],
        },
     {
          step: "Finishing",
          rows: [
            {
              chemical: finishingchem1,
              kgs_needed: getFinishingChem1KgsNeeded(waterLitresDyeing, c66),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: finishingchem2,
              kgs_needed: getFinishingChem2KgsNeeded(waterLitresDyeing, c25, liqRatio8),
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: "",
              kgs_needed: "",
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            {
              chemical: "Water",
              kgs_needed: totalWaterLtrsUsed,
              amt_on_hand:"",
              summary: "",
              cost_per_kg: "",
              total_cost: "",
              cost_per_kg: "",
              needed_totals: "",
              
            },
            
          ],
        },
        

        
  ];
}
