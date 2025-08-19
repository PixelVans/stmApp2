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
} from "../components/functions/dyeingfunc";

import useScouringData from "./useScouringData";
import useHotwashData from "./useHotwashData";

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
  } = useDyeingStore();

  //Fetch Data from the SQL server
 const { values: scouringValues, scouringTemp, scouringTime, scouringPH,hotwashGpl } = useScouringData(scouring, selectedColour, dyeingSystem);
 const { hotwashTemp, hotwashTime, hotwashPH, loading, error } = useHotwashData(selectedColour, dyeingSystem);
 console.log("Hotwash Temperarute is", hotwashTemp)

  const NBSP = "\u00A0";
  const scouringChemical1 = getScouringChemical1({ scouringSystem: scouring })
  const scouringChemical2 = getScouringChemical2({ scouringSystem: scouring })
  const scouringChemical3 = getScouringChemical3({ scouringSystem: scouring })
  const scouringChemical4 = getScouringChemical4({ scouringSystem: scouring })
  const scouringChemical5 = getScouringChemical5({ scouringSystem: scouring })
  const scouringChemical6 = getScouringChemical6({ scouringSystem: scouring })
  const scouringChemical7 = getScouringChemical7({ scouringSystem: scouring })




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

  const chemical = getChemicalField({  saltPosition,saltOption, scouring,dyeingSystem,selectedColour,});
  
  const waterLitresDyeing = computeStartingWaterAmount({lotWeight,liqRatio,winch, });
    
  const gpl = getPrepareToDyeGPL1(dyeingSystem, selectedColour);
  const dwellValue = getRemainInDwell({saltPosition,scouringSystemSelected: scouring,selectedColour, });
  const b26Title = step4sec1Chemical2({saltOption, scouring,})

  const dyeingSecondStep = [
              {
                chemical: getNameAt(Dyestuff_1),
                gramsPerLt: formatNumber(getAmtAt(Dyestuff_1_Amt)),
                amount: computeAmount(Number(getAmtAt(Dyestuff_1_Amt)), lotWeight),
                temp: getDyeingTemp(scouring, selectedColour, dyeingSystem),
                time: getDyeingTime(selectedColour, dyeingSystem),
                ph: getDyeingPh(selectedColour, dyeingSystem),
              },
              {
                chemical: getNameAt(Dyestuff_2),
                gramsPerLt: formatNumber(getAmtAt(Dyestuff_2_Amt)),
                amount: computeAmount(Number(getAmtAt(Dyestuff_2_Amt)), lotWeight),
                temp: "",
                time: "",
                ph: "",
              },
              {
                chemical: getNameAt(Dyestuff_3),
                gramsPerLt: formatNumber(getAmtAt(Dyestuff_3_Amt)),
                amount: computeAmount(Number(getAmtAt(Dyestuff_3_Amt)), lotWeight),
                temp: "",
                time: "",
                ph: "",
              },
              {
                chemical: getNameAt(Dyestuff_4),
                gramsPerLt: formatNumber(getAmtAt(Dyestuff_4_Amt)),
                amount: computeAmount(Number(getAmtAt(Dyestuff_4_Amt)), lotWeight),
                temp: "",
                time: "",
                ph: "",
              },
              { isInstructionRow: true, chemical: dwellValue ?? "" },
              {
                chemical: chemical,
                gramsPerLt: Number(
                  getSaltGramsPerL({ chemicalName: chemical, selectedColour })
                ).toFixed(3),
                amount: computeDyeingSaltAmount({
                  chemicalName: chemical,
                  selectedColour,
                  saltPosition,
                  scouring,
                  waterLitresDyeing: waterLitresDyeing.toFixed(3),
                  lotWeight,
                }),
                temp: getSaltDynamicTemp({ selectedColour, scouring }),
                time: getSaltDynamicDuration({ selectedColour }),
                ph: "",
                rowSpanGroup: "salt",
              },
              {
                chemical: "Total Shade Percentage",
                gramsPerLt: (
                  Number(formatNumber(getAmtAt(Dyestuff_1_Amt))) +
                  Number(formatNumber(getAmtAt(Dyestuff_2_Amt))) +
                  Number(formatNumber(getAmtAt(Dyestuff_3_Amt))) +
                  Number(formatNumber(getAmtAt(Dyestuff_4_Amt)))
                ).toFixed(3),
                rowSpanGroupContinuation: "salt",
              },
  ];

  const dyeingFirstStep = [
          {
                chemical: step4sec1Chemical1({dyeingSystem,  saltPosition}) ,
                gramsPerLt: Number(step4sec1ChemicalGpl({mode: "prepareToDye",selectedColour,scouring })).toFixed(1),
                amount: 'r66rrr',
                temp: "33 dgr",
                time: "not 55",
                ph: "not done",
              },
          {
                chemical: step4sec1Chemical2({saltOption, scouring,}),
                gramsPerLt: Number(step4sec1ChemicalGpl({mode: "dyeing", selectedColour, b26Title })).toFixed(1),
                amount: '',
                temp: "",
                time: "",
                ph: "",
              },
            ];


  return [
     {
          step: "Step 1 — Scouring",
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
          step: "Step 2 — Hot Wash",
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
          step: "Step 3 — Prepare to Dye",
          instructions:
            "ONGEZA ACID KWANZA ALAFU BAADA YA DAKIKA KUMI ONGEZA PEROXIDE KILLER",
          rows: [
            { chemical: "", gramsPerLt: "", amount: "", temp: "", time: "", ph: "" },
            {
              chemical: getPrepareToDyeTitle1(scouring),
              gramsPerLt: getPrepareToDyeGPL1(dyeingSystem, selectedColour),
              amount: getPrepareToDyeAmt1({ gpl,dyeingSystem,lotWeight,waterLitresDyeing, }),
              temp: getPrepareToDyeTemp({scouring, dyeingSystem,  selectedColour,}),
              time: getPrepareToDyeProperty(21, dyeingSystem, selectedColour),
              ph: getPrepareToDyeProperty(22, dyeingSystem, selectedColour),
            },
            {
              chemical: getPrepareToDyeTitle2(scouring, true),
              gramsPerLt: Number(
                getPrepareToDyeGPL2(dyeingSystem,selectedColour,null,scouring) ).toFixed(1),
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
              gramsPerLt: Number(
                getPrepareToDyeGPL3(dyeingSystem, selectedColour, scouring)).toFixed(1),
              
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
    
          step: "Step 4 — Dyeing",
          extraSection: { title: "USIMWAGE MAJI, ONGEZA 50% CHUMVI ALFAU BAADA YA 5 MIN WEKA BALANCE", rows: dyeingFirstStep },
          instructions:
            "ONGEZA 50% YA RANGI — ALAFU BAADA YA DAKIKA KUMI ONGEZA 50%",
          rows: dyeingSecondStep,
        },
  ];
}
