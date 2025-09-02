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

export default function useChemicalSteps() {
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

 

  const NBSP = "\u00A0";
  //scouring chemicals
  const scouringChemical1 = getScouringChemical1({ scouringSystem: scouring })
  const scouringChemical2 = getScouringChemical2({ scouringSystem: scouring })
  const scouringChemical3 = getScouringChemical3({ scouringSystem: scouring })
  const scouringChemical4 = getScouringChemical4({ scouringSystem: scouring })
  const scouringChemical5 = getScouringChemical5({ scouringSystem: scouring })
  const scouringChemical6 = getScouringChemical6({ scouringSystem: scouring })
  const scouringChemical7 = getScouringChemical7({ scouringSystem: scouring })

  const saltOptionstep4 = getChemicalField({  saltPosition, saltOption, scouring, dyeingSystem, selectedColour,});
  
  const waterLitresDyeing = computeStartingWaterAmount({lotWeight,liqRatio,winch, });
  const gpl = getPrepareToDyeGPL1(dyeingSystem, selectedColour);
  const dwellValue = getRemainInDwell({saltPosition,scouringSystemSelected: scouring,selectedColour, });
  const b26Title = step4sec1Chemical2({saltPosition, saltOption, scouring, });
    
   
    
 
  
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

  
  const totalWaterLtrsUsed = totalWaterUsed({waterLitresDyeing, gpl, dyeingSystem,lotWeight,liqRatio,  winch});
  
 
 
  
  


   





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

   


  const dyeingSecondStep = [
              {
                chemical: getNameAt(Dyestuff_1),
                gramsPerLt: dyeingSec2Gpl1 ?? "fetching data...",
                amount: computeAmount(Number(getAmtAt(Dyestuff_1_Amt)), lotWeight),
                temp: dyeingSec2Temp1  ?? "fetching data..",
                time: dyeingSec2Time1 ?? "fetching data..",
                ph: dyeingSec2Ph ?? "fetching data...",
              },
              {
                chemical: getNameAt(Dyestuff_2),
                gramsPerLt: dyeingSec2Gpl2 ?? "fetching data...",
                amount: computeAmount(Number(getAmtAt(Dyestuff_2_Amt)), lotWeight),
                temp: "",
                time: "",
                ph: "",
              },
              {
                chemical: getNameAt(Dyestuff_3),
                gramsPerLt: dyeingSec2Gpl3 ?? "fetching data...",
                amount: computeAmount(Number(getAmtAt(Dyestuff_3_Amt)), lotWeight),
                temp: "",
                time: "",
                ph: "",
              },
              {
                chemical: getNameAt(Dyestuff_4),
                gramsPerLt: dyeingSec2Gpl4 ?? "fetching data...",
                amount: computeAmount(Number(getAmtAt(Dyestuff_4_Amt)), lotWeight),
                temp: "",
                time: "",
                ph: "",
              },
              { isInstructionRow: true, chemical: dwellValue ?? "" },
              {
                //salt filed
                chemical: saltOptionstep4,
                gramsPerLt: dyeingSec2Gpl5 ?? "fetching data...",
                amount: computeDyeingSaltAmount({
                  chemicalName: saltOptionstep4,
                  selectedColour,
                  saltPosition,
                  scouring,
                  waterLitresDyeing: waterLitresDyeing.toFixed(3),
                  lotWeight,
                }),
                
                ph: "",
                rowSpanGroup: "salt",
              },
              {
                chemical: "Total Shade Percentage",
                temp: dyeingSec2Temp2 ?? "fetching data..",
                time: dyeingSec2Time2 ?? "fetching data..",
                gramsPerLt: ( Number(dyeingSec2Gpl1) + Number(dyeingSec2Gpl2) + Number(dyeingSec2Gpl3) +Number(dyeingSec2Gpl4)).toFixed(3),
                rowSpanGroupContinuation: "salt",
              },
  ];

  const dyeingFirstStep = [
          {
                chemical: step4sec1Chemical1({dyeingSystem,  saltPosition}) ,
                gramsPerLt: dyeingSec1Chem1Gpl ?? "fetching data...",
                amount: getDyeingSec1ChemAmt1(dyeingSec1Chem1Gpl ?? 0, waterLitresDyeing, "Kgs"),
                temp: dyeingSec1Temp,
                time: dyeingSec1Duration,
                ph: dyeingSec1Ph,
              },
          {
                chemical: b26Title,
                gramsPerLt: dyeingSec1Chem2Gpl ?? "",
                amount: getDyeingSec1ChemAmt2(dyeingSec1Chem2Gpl ?? 0, waterLitresDyeing,  "Kgs"),
                temp: "",
                time: "",
                ph: "",
              },
            ];


  return [
     {
          step: "Step 1 -  Scouring",
          rows: [
            {
              chemical: scouringChemical1,
              gramsPerLt: "",
              amount: `${computeStartingWaterAmount({  lotWeight,liqRatio, winch, })} Ltrs`,
              temp:scouringTemp ?? "fetching data...",
              time: scouringTime ?? "fetching data...",
              ph: scouringPH ?? "fetching...",
              
            },
            {
              chemical: scouringChemical2,
              gramsPerLt: scouringValues[2] ?? "fetching  data...",
              amount: getScouringChemicalAmount(scouring, selectedColour,2,lotWeight, liqRatio,winch),
              temp: "",
              time: "",
              ph: "",
            },
            {
              chemical: scouringChemical3,
              gramsPerLt: scouringValues[3] ?? "fetching data...",
              amount: getScouringChemicalAmount(scouring,selectedColour,3,lotWeight,liqRatio, winch ),
              temp: "",
              time: "",
              ph: "",
            },
            {
              chemical: scouringChemical4,
              gramsPerLt: scouringValues[4] ?? "fetching data...",
              amount: getScouringChemicalAmount(scouring, selectedColour, 4, lotWeight,liqRatio,winch ),
              temp: "",
              time: "",
              ph: "",
            },
            {
              chemical: scouringChemical5,
              gramsPerLt: scouringValues[5] ?? "fetching data...",
              amount: getScouringChemicalAmount( scouring,selectedColour,5,lotWeight,liqRatio,winch),
              temp: "",
              time: "",
              ph: "",
            },
            {
              chemical: scouringChemical6,
              gramsPerLt: scouringValues[6] ?? "",
              amount: getScouringChemicalAmount(scouring, selectedColour, 6, lotWeight,liqRatio,   winch),
              temp: "",
              time: "",
              ph: "",
            },
            {
              chemical: scouringChemical7,
              gramsPerLt: scouringValues[7] ?? "",
              amount: getScouringChemicalAmount(scouring,selectedColour,7,lotWeight, liqRatio,  winch),
              temp: "",
              time: "",
              ph: "Drain",
            },
          ],
        },
        {
          step: "Step 2 -  Hot Wash",
          rows: [
            { chemical: "", gramsPerLt: "", amount: "", temp: "", time: "", ph: "" },
            {
              chemical: getHotWashTitle1(dyeingSystem),
              gramsPerLt: "",
              amount: `${computeRoundedWater80({  lotWeight,liqRatio,winch,  })} Ltrs`,
              temp: hotwashTemp ?? "fetching data...",
              time: hotwashTime ?? "fetching data...",
              ph: hotwashPH ?? "fetching data...",
            },
            {
              chemical: getHotWashTitle2(dyeingSystem),
              gramsPerLt: hotwashGpl,
              amount: computeHotwashAmount({ selectedColour,dyeingSystem,lotWeight, liqRatio,winch, }),
              temp: "",
              time: "",
              ph: "Drain",
            },
          ],
        },
        {
          step: "Step 3 -  Prepare to Dye",
          instructions:
            "ONGEZA ACID KWANZA ALAFU BAADA YA DAKIKA KUMI ONGEZA PEROXIDE KILLER",
          rows: [
            { chemical: "", gramsPerLt: "", amount: "", temp: "", time: "", ph: "" },
            {
              chemical: getPrepareToDyeTitle1(scouring),
              gramsPerLt: prepareToDyeChem1Gpl ?? "fetching data...",
              amount: getPrepareToDyeAmt1({ gpl,dyeingSystem,lotWeight,waterLitresDyeing, }),
              temp: prepareToDyeTemp,
              time: prepareToDyeTime,
              ph: prepareToDyePh,
            },
            {
              chemical: getPrepareToDyeTitle2(scouring, true),
              gramsPerLt: prepareToDyeChem2Gpl ?? "fetching data...",
                amount: getPrepareToDyeAmt({
                gpl: getPrepareToDyeGPL2(dyeingSystem,selectedColour,null,scouring),
                dyeingSystem,
                lotWeight,
                waterLitresDyeing,
              }),
              temp: "",
              time: "",
              ph: "",
            },
            {
              chemical: getPrepareToDyeTitle3(scouring),
              gramsPerLt: prepareToDyeChem3Gpl ?? "fetching data...",
              
              amount: getPrepareToDyeAmt({
                gpl: getPrepareToDyeGPL3(dyeingSystem,selectedColour,scouring),
                dyeingSystem,
                lotWeight,
                waterLitresDyeing,
              }),
              temp: "",
              time: "",
              ph: "",
            },
          ],
        },
        {					
    
          step: "Step 4 -  Dyeing",
          extraSection: { title: "USIMWAGE MAJI, ONGEZA 50% CHUMVI ALFAU BAADA YA 5 MIN WEKA BALANCE", rows: dyeingFirstStep },
          instructions:
            "ONGEZA 50% YA RANGI — ALAFU BAADA YA DAKIKA KUMI ONGEZA 50%",
          rows: dyeingSecondStep,
        },

        {
          step: "END",
          instructions:
            "ONGEZA 30% YA MAGADI NA CAUSTIC ALAFU BAADA YA DAKIKA ISHIRINI ONGEZA 70%",
          rows: [
            
            {
              chemical: getEndChemical1( scouring, 6 ),
              gramsPerLt: endGpl1 ?? "fetching data...",
              amount: getEndChemicalAmount(endGpl1,  waterLitresDyeing,) ,
              temp: endTemp ?? "fetching data...",
              time: endDuration ?? "fetching data...",
              ph: endPh ?? "fetching data...",
            },
            {
              chemical: getEndChemical1( scouring, 8 ),
              gramsPerLt: endGpl2 ?? "fetching data...",
              amount: getEndChemicalAmount(endGpl2,  waterLitresDyeing,) ,
              temp: "",
              time: "",
              ph: "",
            },
           
          ],
        },

      
        {
          step: "Step 5 -  First Rinse",
          instructions:
            "",
          rows: [
            { chemical: "", gramsPerLt: "", amount: "", temp: "", time: "", ph: "" },
            {
              chemical: getFirstRinseChem1( scouring),
              gramsPerLt: "",
              amount: roundupWater(waterLitresDyeing) + " Ltrs",
              temp: firstRinseTemp ?? "fetching data...",
              time: firstRinseDuration ?? "fetching data...",
              ph: firstRinsePh ?? "fetching data...",
            },
            { chemical: "", gramsPerLt: "", amount: "", temp: "", time: "", ph: "Drain" },
           
          ],
        },
        {
          step: "Step 6 - Soaping",
          instructions:
            "ONGEZA ACID ALAFU WAKATI pH IKO CHINI YA NANE, ONGEZA FELOSAN THEN 70°C",
          rows: [
            
            {
              chemical: getSoapingChem1( scouring),
              gramsPerLt:  "",
              amount: roundupWater(waterLitresDyeing) + " Ltrs",
              temp: soapingTemp ?? "fetching data...",
              time: soapingDuration ?? "fetching data...",
              ph: soapingPh ?? "fetching data...",
            },
            
            {
              chemical: getFirstRinseChem2(scouring, soaping),
              gramsPerLt: soapingGpl1 ?? "fetching data...",
              amount: getSoapingChemAmt(soapingGpl1,  waterLitresDyeing,) ,
              temp: "",
              time: "",
              ph: "",
            },
            
            {
              chemical: getFirstRinseChem3(scouring),
              gramsPerLt: soapingGpl2 ?? "fetching data...",
              amount: getSoapingChemAmt(soapingGpl2,  waterLitresDyeing,) ,
              temp: "",
              time: "",
              ph: "Drain",
            },
            
           
          ],
        },
        {
          step: "Step 7 - Final_Rinse",
          instructions:
            "",
          rows: [
            
            {
              chemical: getFinalRinseChem1(scouring),
              gramsPerLt: "",
              amount:  roundupWater(waterLitresDyeing) + " Ltrs",
              temp: finalRinseTemp ?? "fetching data...",
              time: finalRinseDuration ?? "fetching data...",
              ph: finalRinsePh ?? "fetching data...",
            },
            
            {
              chemical: "",
              gramsPerLt: "",
              amount: "",
              temp: "",
              time: "",
              ph: "Drain",
            },
            
           
            
           
          ],
        },
        {
          step: "Step 8 - Finishing",
          instructions:
            "HAKIKISHA pH KABLA KUWEKA SOFTENER (Repeat if necessary)",
          rows: [
            
            {
              chemical: getFinishingChem1(scouring),
              gramsPerLt:  "",
              amount: roundupWater(waterLitresDyeing) + " Ltrs",
              temp: finishingTemp ?? "fetching data...",
              time: finishingDuration ?? "fetching data...",
              ph: finishingPh ?? "fetching data...",
            },
            
            {
              chemical: getFinishingChem2(scouring, softener),
              gramsPerLt: finishingGpl1 ?? "fetching data...",
              amount: getFinishingChemAmt(finishingGpl1,  waterLitresDyeing,) ,
              temp: "",
              time: "",
              ph: "",
            },
            
            {
              chemical: getFinishingChem3(scouring, liqRatio8),
              gramsPerLt: finishingGpl2 ?? "fetching data...",
              amount: getFinishingChemAmt(finishingGpl2,  waterLitresDyeing,) ,
              temp: "",
              time: "",
              ph: "",
            },
            {
              chemical: "",
              gramsPerLt: "",
              amount: "",
              temp: "",
              time: "",
              ph: "Drain",
            },
            {
              chemical: "Total Water Litres Used",
              gramsPerLt: "",
              amount: totalWaterLtrsUsed,
              temp: "",
              time: "",
              ph: "",
            },
            
           
          ],
        },
       

        
  ];
}
