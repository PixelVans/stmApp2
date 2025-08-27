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



 
  return [
     {
          step: "Scouring",
          rows: [
            {
              chemical_summary: "",
              kgs_needed: "",
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
              chemical_summary: "",
              kgs_needed: "",
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
          rows: [
            {
              chemical_summary: "",
              kgs_needed: "",
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
              chemical_summary: "",
              kgs_needed: "",
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
