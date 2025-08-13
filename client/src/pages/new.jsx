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
  computeStartingWaterAmount,
} from "../components/functions/dyeingfunc";

const ChemicalTable = () => {
  const {
    winch,
    lotNo,
    softener,
    scouring,
    saltOption,
    client,
    article,
    dyeFix,
    selectedColour,
    saltPosition,
    liqRatio,
    lotWeight,
    dyeingSystem,
  } = useDyeingStore();

  const chemical = getChemicalField({
    saltPosition,
    saltOption,
    scouring,
    dyeingSystem,
    selectedColour,
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
  return n.toFixed(3);
};


  const dwellValue = getRemainInDwell({
    saltPosition,
    scouringSystemSelected: scouring,
    selectedColour,
  });

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
    { isInstructionRow: true, chemical: dwellValue ?? "" },

    // Salt row with rowspan group
    {
      chemical: chemical,
      gramsPerLt: Number(getSaltGramsPerL({ chemicalName: chemical, selectedColour })).toFixed(3),
      amount: computeDyeingSaltAmount({
        chemicalName: chemical,
        selectedColour,
        saltPosition,
        scouring,
        waterLitresDyeing: computeStartingWaterAmount({
        lotWeight,
        liqRatio,
        winch
      }).toFixed(3),
        lotWeight,
      }),
      temp: getSaltDynamicTemp({ selectedColour, scouring }),
      time: getSaltDynamicDuration({ selectedColour }),
      ph: "",
      rowSpanGroup: "salt",
    },
    {
      chemical: "Total Shade Percentage",
      gramsPerLt:(
          Number(formatNumber(getAmtAt(Dyestuff_1_Amt))) +
          Number(formatNumber(getAmtAt(Dyestuff_2_Amt))) +
          Number(formatNumber(getAmtAt(Dyestuff_3_Amt))) +
          Number(formatNumber(getAmtAt(Dyestuff_4_Amt)))
        ).toFixed(3),
      amount: "",
      temp: "",
      time: "",
      ph: "",
      rowSpanGroupContinuation: "salt",
    },
  ];

  const steps = [
    {
      step: "Step 1 — Scouring",
        rows: [
      {
        chemical: "Starting Water",
        gramsPerLt: "",
        amount: `${computeStartingWaterAmount({
        lotWeight,
        liqRatio,
        winch
      })} Ltrs`,
      
        temp: "60˚C",
        time: "30 Minutes",
        ph: "9 - 10"
      },
      {
        chemical: "Ketoprep L.A",
        gramsPerLt: 0.5,
        amount: computeAmount(0.5, lotWeight),
        temp: "",
        time: "",
        ph: ""
      },
      {
        chemical: "Caustic Soda",
        gramsPerLt: 3.2,
        amount: computeAmount(3.2, lotWeight),
        temp: "",
        time: "",
        ph: ""
      },
      {
        chemical: "Hydrogen Peroxide",
        gramsPerLt: 4.0,
        amount: computeAmount(4.0, lotWeight),
        temp: "",
        time: "",
        ph: ""
      },
      {
        chemical: "Magadi Soda Ash",
        gramsPerLt: 1.3,
        amount: computeAmount(1.3, lotWeight),
        temp: "",
        time: "",
        ph: ""
      }
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

  const NBSP = "\u00A0"; 

  return (
    <div>
      <DyeingControlPanel />
      {steps.map((stepData, sIdx) => (
        <div key={sIdx} className="mb-8 p-4 sm:p-6">
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
                  let normalCounter = 0;
                  return stepData.rows.map((r, i) => {
                    const chemText = (r.chemical || "").toString().toUpperCase().trim();

                    const isInstructionRow = !!r.isInstructionRow ||
                      chemText.includes("REMAIN IN DWELL") ||
                      chemText.includes("WAIT FOR") ||
                      chemText === "E" ||
                      chemText.includes("20 MIN");

                    if (isInstructionRow) {
                      return (
                        <tr key={`${sIdx}-${i}`}>
                          <td colSpan={6} className="border border-gray-300 p-0">
                            <div className="bg-yellow-200 h-12 w-full flex items-center justify-center font-bold">
                              {String(r.chemical || "").trim() !== "" ? String(r.chemical) : NBSP}
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    const rowClass = normalCounter % 2 === 0 ? "bg-white" : "bg-gray-50";

                    if (r.rowSpanGroupContinuation) {
                      normalCounter++;
                      return (
                        <tr key={`${sIdx}-${i}`} className={rowClass}>
                          <td className="border border-gray-300 px-2 py-1">{r.chemical || NBSP}</td>
                          <td className="border border-gray-300 px-2 py-1 text-right">{r.gramsPerLt || NBSP}</td>
                          <td className="border border-gray-300 px-2 py-1">{r.amount || NBSP}</td>
                        </tr>
                      );
                    }

                    if (r.rowSpanGroup) {
                      normalCounter++;
                      return (
                        <tr key={`${sIdx}-${i}`} className={rowClass}>
                          <td className="border border-gray-300 px-2 py-1">{r.chemical || NBSP}</td>
                          <td className="border border-gray-300 px-2 py-1 text-right">{r.gramsPerLt || NBSP}</td>
                          <td className="border border-gray-300 px-2 py-1">{r.amount || NBSP}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center align-middle" rowSpan={2}>{r.temp || NBSP}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center align-middle" rowSpan={2}>{r.time || NBSP}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center align-middle" rowSpan={2}>{r.ph || NBSP}</td>
                        </tr>
                      );
                    }

                    normalCounter++;
                    return (
                      <tr key={`${sIdx}-${i}`} className={rowClass}>
                        <td className="border border-gray-300 px-2 py-1">{r.chemical || NBSP}</td>
                        <td className="border border-gray-300 px-2 py-1 text-right">{r.gramsPerLt || NBSP}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.amount || NBSP}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.temp || NBSP}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.time || NBSP}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.ph || NBSP}</td>
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
