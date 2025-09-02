import React, { forwardRef } from "react";
import useChemicalSteps from "../hooks/dyeing/useChemicalSteps";
import ChemicalStepTable from "../components/ChemicalStepTable";
import usedyeingSummarySteps from "../hooks/dyeing/usedyeingSummarySteps";
import ChemicalSummaryTable from "../components/ChemicalSummaryTable";
import useDyeingStore from "../store/zustand";
import { getTailwindColor } from "../utils/constants";
import { getTotals } from "../components/functions/dyeingfunc";

const DyeingCardCustomPrint = forwardRef((props, ref) => {
  const steps = useChemicalSteps();
  const summarySteps = usedyeingSummarySteps();
  const { scouring, selectedColour, softener,client,article,lotNo,winch,dyeingSystem, 
    liqRatio8,lotWeight,saltOption,saltPosition,soaping,liqRatio} = useDyeingStore();


const totals = getTotals(summarySteps);

  return (
    <div ref={ref} className="p-2 bg-white lg:ml-64 items-center">
   <div className="border border-gray-300 p-2 mb-3 rounded text-xs text-gray-700">
  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-1">
    <div><strong>Client:</strong> {client}</div>
    <div><strong>Lot No:</strong> {lotNo}</div>
    <div><strong>Article:</strong> {article}</div>
    <div><strong>Winch:</strong> {winch}</div>
    <div><strong>Dyeing System:</strong> {dyeingSystem}</div>
    <div><strong>Shade:</strong> <span className={getTailwindColor(selectedColour)}>{selectedColour}</span></div>
    <div><strong>Scouring:</strong> {scouring}</div>
    <div><strong>Softener:</strong> {softener}</div>
    <div><strong>Liq. Ratio:</strong> {liqRatio}</div>
    <div><strong>Liq. 8:</strong> {liqRatio8}</div>
    <div><strong>Weight:</strong> {lotWeight}</div>
    <div><strong>Salt Opt:</strong> {saltOption}</div>
    <div><strong>Salt Pos:</strong> {saltPosition}</div>
    <div><strong>Soaping:</strong> {soaping}</div>
  </div>
</div>



{steps.map((step, sIdx) => (
        <div key={sIdx} className="sm:p-4 border-b border-gray-200">
          {step.step === "END" && (
            <img
              src="/images/Picture1.png"
              alt="Process illustration"
              className="mb-5 mt-5 w-auto mx-auto"
            />
          )}

           {step.step == "Step 5 -  First Rinse" && (
            <h3 className="italic text-sm mb-2 text-blue-600">
              BAADA YA KUONGEZA MAGADI NA CAUSTIC, DWELL KWA DAKIKA ARUBAINE NA TANO AT 60°C</h3>
           )}
          <h2 className="text-md md:text-lg font-bold ">{step.step}</h2>
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
      <h1 className="p-4 text-center mx-auto">Summary</h1>
      </div>

      {/* Summary Steps */}
      {summarySteps.map((step, sIdx) => (
        <div key={sIdx} className="sm:p-1 border-b border-gray-200">
          <h2 className="text-md">{step.step}</h2>
          <div className="text-xs">
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

export default DyeingCardCustomPrint;
