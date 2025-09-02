import  { forwardRef } from "react";
import useChemicalSteps from "../hooks/dyeing/useChemicalSteps";
import ChemicalStepTable from "../components/ChemicalStepTable";
import usedyeingSummarySteps from "../hooks/dyeing/usedyeingSummarySteps";
import ChemicalSummaryTable from "../components/ChemicalSummaryTable";
import useDyeingStore from "../store/zustand";
import { getTailwindColor } from "../utils/constants";
import { getTotals } from "../components/functions/dyeingfunc";

const ChemicalTable = forwardRef((props, ref) => {
  const steps = useChemicalSteps();
  const summarySteps = usedyeingSummarySteps();
  const { scouring, selectedColour, softener } = useDyeingStore();


const totals = getTotals(summarySteps);

  return (
    <div ref={ref} className="p-2 mt-2 bg-white lg:ml-64 ">
      
      {steps.map((step, sIdx) => (
        <div key={sIdx} className="sm:p-4 ">
          {step.step === "" && (
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

          <h2 className="text-md md:text-lg font-bold mt-9 ">{step.step}</h2>
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
        <div key={sIdx} className="sm:p-1 ">
          <h2 className="text-md">{step.step}</h2>
          {step.instructions && (
            <p className="text-sm mb-2 ">
              SHADE:{" "}
              <span className={`text-sm mb-2 font-bold ${getTailwindColor(selectedColour)}`}>
                {selectedColour}hhhh
              </span>
            </p>
          )}
          <div className="text-xs">
            <ChemicalSummaryTable rows={step.rows} />
          </div>
        </div>
      ))}

      {/* Totals Section */}
      <div className="mt-5 mx-auto mb-15 max-w-md rounded-2xl bg-white border border-gray-300 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-400 px-4 py-2">
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
