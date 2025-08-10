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
  duration_dyeing
} from "../utils/constants";

import DyeingControlPanel from "../components/DyeingControlPanel";
import useDyeingStore from "../store/zustand";
import { ingredients } from "../utils/ingredients_dyeing.js";



const UNIT_KG = " Kgs";
const UNIT_G = " gms";

function computeAmount(gramsPerLt, lotWeight) {
  if (!gramsPerLt || !lotWeight) return "";
  const totalGrams = gramsPerLt * (lotWeight * 10);
  if (totalGrams >= 1000) {
    const wholeKg = Math.trunc(totalGrams / 1000);
    const grams = Math.round(totalGrams % 1000);
    return grams > 0
      ? `${wholeKg}${UNIT_KG} ${grams}${UNIT_G}`
      : `${wholeKg}${UNIT_KG}`;
  } else {
    return `${Math.round(totalGrams)}${UNIT_G}`;
  }
}

function getDyeingTemp(scouringSystemSelected, colourSelected, dyeingSystemSelected) {
  if (scouringSystemSelected === "CreamStripe") return "40˚C";
  const rowIndex = Colour_Chart.indexOf(colourSelected);
  
  if (rowIndex === -1) return "";
  const positionArray = positions_dyeing[dyeingSystemSelected];
  if (!positionArray) return "";
  const dyeing_temp = temperatures_dyeing[rowIndex];
 
  return dyeing_temp;
}   

function getDyeingTime( colourSelected, dyeingSystemSelected) {
 const rowIndex = Colour_Chart.indexOf(colourSelected)  ;

  if (rowIndex === -1) return "";
  
  const positionArray = positions_dyeing[dyeingSystemSelected];
  if (!positionArray) return "";

 
  const dyeing_duration = duration_dyeing[rowIndex];
  console.log(rowIndex)
  return dyeing_duration;
}                                                                                 


const ChemicalTable = () => {
  // Pull Zustand store fields reactively
  const { selectedColour, lotWeight, dyeingSystem, scouring } = useDyeingStore();

  // Memoize the selected index for efficient lookup
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

  // Use the reactive store values to get the temp dynamically
  function getStepTemp(system, stepNumber) {
    return getDyeingTemp(scouring, selectedColour, system);
  }

  // Dynamic dyeing step rows with reactive temp
  const dyeingRows = [
    {
      chemical: getNameAt(Dyestuff_1),
      gramsPerLt: formatNumber(getAmtAt(Dyestuff_1_Amt)),
      temp: getStepTemp(dyeingSystem, 4),
      time: getDyeingTime(selectedColour, dyeingSystem),

      ph: "7",
    },
    {
      chemical: getNameAt(Dyestuff_2),
      gramsPerLt: formatNumber(getAmtAt(Dyestuff_2_Amt)),
    },
    {
      chemical: getNameAt(Dyestuff_3),
      gramsPerLt: formatNumber(getAmtAt(Dyestuff_3_Amt)),
    },
    {
      chemical: getNameAt(Dyestuff_4),
      gramsPerLt: formatNumber(getAmtAt(Dyestuff_4_Amt)),
    },
    { chemical: "REMAIN IN DWELL FOR 20 MINS" },
    {
      chemical: "Industrial Salt",
      gramsPerLt: "60.000",
      temp: "60˚C",
      time: "30 Minutes",
    },
    { chemical: "Total Shade Percentage" },
  ].map((r) => ({
    ...r,
    amount: r.gramsPerLt ? computeAmount(Number(r.gramsPerLt), lotWeight) : "",
  }));

  const steps = [
    {
      step: "Step 1 — Scouring",
      rows: [
        { chemical: "Starting Water", temp: "60˚C", time: "30 Minutes", ph: "9 - 10" },
        { chemical: "Ketoprep L.A", gramsPerLt: 0.5 },
        { chemical: "Caustic Soda", gramsPerLt: 3.2 },
        { chemical: "Hydrogen Peroxide", gramsPerLt: 4.0 },
        { chemical: "Magadi Soda Ash", gramsPerLt: 1.3 },
      ],
    },
    { step: "Step 2 — Hot Wash", rows: [{ chemical: "Water", temp: "50˚C", time: "20 Minutes", ph: "8 - 9" }] },
    {
      step: "Step 3 — Prepare to Dye",
      instructions: "ONGEZA ACID KWANZA ALAFU BAADA YA DAKIKA KUMI ONGEZA PEROXIDE KILLER",
      rows: [
        { chemical: "Water", temp: "40˚C", time: "10 Minutes", ph: "7" },
        { chemical: "Acetic or Green Acid", gramsPerLt: 1.0 },
        { chemical: "Peroxide Killer/Peroxy ALK", gramsPerLt: 1.0 },
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
                {stepData.rows.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 px-2 py-1">{r.chemical}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      {r.gramsPerLt ?? ""}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">{r.amount ?? ""}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.temp ?? ""}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.time ?? ""}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.ph ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChemicalTable;
