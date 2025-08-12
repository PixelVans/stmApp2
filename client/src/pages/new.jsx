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
 } from "../utils/constants";

import DyeingControlPanel from "../components/DyeingControlPanel";
import useDyeingStore from "../store/zustand";
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
  
} from "../components/functions/dyeingfunc";



const ChemicalTable = () => {
  const {winch,lotNo, softener, scouring, saltOption, client, 
  article, dyeFix, selectedColour,saltPosition, liqRatio, lotWeight, dyeingSystem } = useDyeingStore();

const chemical = getChemicalField({
  saltPosition,
  saltOption,
  scouring,
  dyeingSystem,
  selectedColour
});


 
 
  const selectedIndex = React.useMemo(() => {
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
    return v === null || v === undefined || v === "" ? "" : v;
  };

  const formatNumber = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    const n = Number(val);
    if (Number.isNaN(n)) return String(val);
    return n % 1 === 0 ? n.toFixed(0) : n.toFixed(3).replace(/\.?0+$/, "");
  };

  const dyeingRows = [
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
    {
      chemical: getRemainInDwell({
        saltPosition,
        scouringSystemSelected: scouring,
        selectedColour,
      }),
      

      gramsPerLt: "",
      amount: "",
      temp: "",
      time: "",
      ph: "",
    },
    {
      chemical: chemical,
      gramsPerLt: getSaltGramsPerL({
      chemicalName: chemical,
      selectedColour,
      
    }),
      amount: computeDyeingSaltAmount({
      chemicalName: chemical,
      selectedColour,
      saltPosition,
      scouring,
      waterLitresDyeing: 28800,
      lotWeight,
    }),
      temp: getSaltDynamicTemp({
      selectedColour,
      scouring,
      
    }),

      time: getSaltDynamicDuration({
      selectedColour,
    }),
      ph: "",
    },
    {
      chemical: "Total Shade Percentage",
      gramsPerLt: 'hhhhh',
      amount: "",
      temp: "",
      time: "",
      ph: "",
    },
  ];

  const steps = [
    {
      step: "Step 1 — Scouring",
      rows: [
        { chemical: "Starting Water", gramsPerLt: "", amount: "", temp: "60˚C", time: "30 Minutes", ph: "9 - 10" },
        { chemical: "Ketoprep L.A", gramsPerLt: 0.5, amount: computeAmount(0.5, lotWeight), temp: "", time: "", ph: "" },
        { chemical: "Caustic Soda", gramsPerLt: 3.2, amount: computeAmount(3.2, lotWeight), temp: "", time: "", ph: "" },
        { chemical: "Hydrogen Peroxide", gramsPerLt: 4.0, amount: computeAmount(4.0, lotWeight), temp: "", time: "", ph: "" },
        { chemical: "Magadi Soda Ash", gramsPerLt: 1.3, amount: computeAmount(1.3, lotWeight), temp: "", time: "", ph: "" },
      ],
    },
    {
      step: "Step 2 — Hot Wash",
      rows: [
        { chemical: "Water", gramsPerLt: "", amount: "", temp: "50˚C", time: "20 Minutes", ph: "8 - 9" },
      ],
    },
    {
      step: "Step 3 — Prepare to Dye",
      instructions: "ONGEZA ACID KWANZA ALAFU BAADA YA DAKIKA KUMI ONGEZA PEROXIDE KILLER",
      rows: [
        { chemical: "Water", gramsPerLt: "", amount: "", temp: "40˚C", time: "10 Minutes", ph: "7" },
        { chemical: "Acetic or Green Acid", gramsPerLt: 1.0, amount: computeAmount(1.0, lotWeight), temp: "", time: "", ph: "" },
        { chemical: "Peroxide Killer/Peroxy ALK", gramsPerLt: 1.0, amount: computeAmount(1.0, lotWeight), temp: "", time: "", ph: "" },
      ],
    },
    {
      step: "Step 4 — Dyeing",
      instructions: "ONGEZA 50% YA RANGI — ALAFU BAADA YA DAKIKA KUMI ONGEZA 50%",
      rows: dyeingRows,
    },
  ];

  return (
    <div className="p-2">
      <DyeingControlPanel />
      {steps.map((stepData, sIdx) => (
        <div key={sIdx} className="mb-8">
          <h2 className="text-lg font-bold mb-2">{stepData.step}</h2>
          {stepData.instructions && (
            <p className="italic text-sm mb-2">{stepData.instructions}</p>
          )}
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-2 py-1 text-left">Chemical</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">Grams/lt</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Amount</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Temp</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Time</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">pH</th>
                </tr>
              </thead>
             <tbody>
            {(() => {
              let normalCounter = 0; // keeps alternating row stripes for non-dwell rows
              return stepData.rows.map((r, i) => {
                const isInstructionRow =
                  (r.chemical && r.chemical.toUpperCase().includes("REMAIN IN DWELL FOR 20 MINS")) 

                if (isInstructionRow) {
                  return (
                    <tr key={i}>
                      <td colSpan={6} className="border border-gray-300 p-0">
                        {/* inner div preserves background + fixed height even when empty */}
                        <div className="bg-yellow-200 h-12 w-full flex items-center justify-center font-bold">
                          {r.chemical ?? "\u00A0"}
                        </div>
                      </td>
                    </tr>
                  );
                }

                const rowClass = normalCounter % 2 === 0 ? "bg-white" : "bg-gray-50";
                normalCounter++;

                return (
                  <tr key={i} className={rowClass}>
                    <td className="border border-gray-300 px-2 py-1">{r.chemical || "\u00A0"}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{r.gramsPerLt || "\u00A0"}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.amount || "\u00A0"}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.temp || "\u00A0"}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.time || "\u00A0"}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.ph || "\u00A0"}</td>
                  </tr>
                );
              });
            })()}
          </tbody>


            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChemicalTable;
