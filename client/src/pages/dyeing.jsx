import React, { forwardRef } from "react";
import useChemicalSteps from "../hooks/dyeing/useChemicalSteps";
import ChemicalStepTable from "../components/ChemicalStepTable";
import usedyeingSummarySteps from "../hooks/dyeing/usedyeingSummarySteps";
import ChemicalSummaryTable from "../components/ChemicalSummaryTable";
import useDyeingStore from "../store/zustand";
import { getTailwindColor } from "../utils/constants";

const ChemicalTable = forwardRef((props, ref) => {
  const steps = useChemicalSteps();
  const summarySteps = usedyeingSummarySteps();
  const { scouring, selectedColour, softener } = useDyeingStore();



  // totals function
function getTotals(allSteps) {
  const toNumber = val => {
    const num = Number(String(val).replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  };

  // Needed totals (all rows from all steps)
  const totalsNeeded = allSteps
    .flatMap(step => step.rows)
    .reduce((sum, row) => sum + toNumber(row.needed_totals), 0);

  // Chemicals Total
  let chemicalsTotal = 0;

  allSteps.forEach(step => {
    if (step.step === "Scouring" || step.step === "Prepare To Dye") {
      // take all total_cost
      chemicalsTotal += step.rows.reduce((s, r) => s + toNumber(r.total_cost), 0);
    }

    if (step.step === "Dyeing" && step.rows.length > 0) {
      // take *last row only*
      const lastRow = step.rows[step.rows.length - 1];
      chemicalsTotal += toNumber(lastRow.total_cost);
    }

    if (step.step === "Finishing" && step.rows.length >= 2) {
      // take *last 2 rows only*
      const lastTwo = step.rows.slice(-2);
      chemicalsTotal += lastTwo.reduce((s, r) => s + toNumber(r.total_cost), 0);
    }
  });

  // Dyestuffs Total = first 3 rows only (if they exist)
  let dyestuffsTotal = 0;
  const dyeingStep = allSteps.find(s => s.step === "Dyeing");
  if (dyeingStep && dyeingStep.rows.length > 0) {
    const firstThree = dyeingStep.rows.slice(0, 3);
    dyestuffsTotal = firstThree.reduce((s, r) => s + toNumber(r.total_cost), 0);
  }

  // Combined
  const chemicalsAndDyesTotal = chemicalsTotal + dyestuffsTotal;

return {
  totalsNeeded: totalsNeeded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  chemicalsTotal: chemicalsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  dyestuffsTotal: dyestuffsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  chemicalsAndDyesTotal: chemicalsAndDyesTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

}


const totals = getTotals(summarySteps);

  return (
    <div ref={ref} className="p-2 sm:p-4 bg-white lg:ml-64">
      
      {steps.map((step, sIdx) => (
        <div key={sIdx} className="sm:p-4 border-b border-gray-200">
          {step.step === "END" && (
            <img
              src="/images/Picture1.png"
              alt="Process illustration"
              className="mb-7 mt-7 w-auto mx-auto"
            />
          )}
          <h2 className="text-md md:text-lg font-bold mt-[10px]">{step.step}</h2>
          {step.extraSection && (
            <>
              <h3 className="italic text-sm mb-2 text-blue-600">
                {step.extraSection.title}
              </h3>
              <div className="mb-4">
                <ChemicalStepTable rows={step.extraSection.rows} />
              </div>
            </>
          )}
          {step.instructions && (
            <p className="italic text-sm mb-2 text-blue-600">{step.instructions}</p>
          )}
          <div className="mt-5">
            <ChemicalStepTable rows={step.rows} />
          </div>
        </div>
      ))}

      {/* Scouring & Softener Summary */}
      <div className="mt-5 mb-5 mx-auto max-w-xl rounded-2xl bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 text-sm font-medium text-gray-700">Scouring System Selected</td>
              <td className="px-4 py-2 text-sm font-bold text-indigo-600">{scouring}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-sm font-medium text-gray-700">Softener Selected</td>
              <td className="px-4 py-2 text-sm font-bold text-indigo-600">{softener}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Steps */}
      {summarySteps.map((step, sIdx) => (
        <div key={sIdx} className="sm:p-4 border-b border-gray-200">
          <h2 className="text-md font-bold">{step.step}</h2>
          {step.instructions && (
            <p className="text-sm mb-2 font-bold">
              SHADE:{" "}
              <span className={`text-sm mb-2 font-bold ${getTailwindColor(selectedColour)}`}>
                {selectedColour}
              </span>
            </p>
          )}
          <div>
            <ChemicalSummaryTable rows={step.rows} />
          </div>
        </div>
      ))}

      {/* Totals Section */}
      <div className="mt-5 mx-auto max-w-md rounded-2xl bg-white border border-gray-300 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-500 px-4 py-2">
          <h2 className="text-white text-lg font-semibold tracking-wide">Total Cost</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 text-sm font-medium text-gray-700">Chemicals Totals</td>
              <td className="px-4 py-2 text-sm font-bold ">Ksh {totals.chemicalsTotal}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 text-sm font-medium text-gray-700">Dyestuffs Total</td>
              <td className="px-4 py-2 text-sm font-bold ">Ksh {totals.dyestuffsTotal}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-sm font-medium text-gray-700">Chemicals & Dyes Total</td>
              <td className="px-4 py-2 text-sm font-bold ">Ksh {totals.chemicalsAndDyesTotal}</td>
            </tr>
            <tr className="hidden">
              <td className="px-4 py-2 text-sm font-medium text-gray-700">Needed Totals</td>
              <td className="px-4 py-2 text-sm font-bold ">Ksh {totals.totalsNeeded}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ChemicalTable;
