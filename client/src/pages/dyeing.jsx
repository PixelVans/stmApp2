import React, { forwardRef } from "react";
import useChemicalSteps from "../hooks/useChemicalSteps";
import ChemicalStepTable from "../components/ChemicalStepTable";

import usedyeingSummarySteps from "../hooks/usedyeingSummarySteps";
import ChemicalSummaryTable from "../components/ChemicalSummaryTable";
import useDyeingStore from "../store/zustand";
import { getTailwindColor } from "../utils/constants";

const ChemicalTable = forwardRef((props, ref) => {
  const steps = useChemicalSteps();
  const summarySteps = usedyeingSummarySteps()
  const {scouring, selectedColour,softener,} = useDyeingStore();
      
    
  return (
    <div
      ref={ref}
      className=" p-2 sm:p-4 bg-white  lg:ml-64"
    >
      {steps.map((step, sIdx) => (
        <div key={sIdx} className=" sm:p-4   border-b border-gray-200">
          {step.step === "END" && (
            <img
              src="/images/Picture1.png"
              alt="Process illustration"
              className="mb-7 mt-7 w-auto mx-auto"
            />
          )}
          <h2 className="text-md  md:text-lg font-bold mt-[20px]">{step.step}</h2>

          {step.extraSection && (
            <>
              <h3 className="italic text-sm mb-2 text-blue-600">
                {step.extraSection.title}
              </h3>
              <div className="mb-4 ">
                <ChemicalStepTable rows={step.extraSection.rows} />
              </div>
            </>
          )}

          {step.instructions && (
            <p className="italic text-sm mb-2 text-blue-600">
              {step.instructions}
            </p>
          )}

          <div className="mt-5">
            <ChemicalStepTable rows={step.rows} />
          </div>

      
        </div>
      ))}

      <div className="mt-5 mb-5 mx-auto max-w-xl rounded-2xl bg-white  border border-gray-200 overflow-hidden">
      
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


       {summarySteps.map((step, sIdx) => (
        <div key={sIdx} className=" sm:p-4   border-b border-gray-200">
          
          <h2 className="text-md font-bold">{step.step}</h2>
          {step.instructions && (
            <p className={`text-sm mb-2 font-bold`}>
              SHADE: <span className={`text-sm mb-2 font-bold ${getTailwindColor(selectedColour)}`}>{selectedColour}</span> 
            </p>
          )}


          <div className="">
            <ChemicalSummaryTable rows={step.rows} />
          </div>

      
        </div>
      ))}


      {/* Totals Section */}
  <div className="mt-5 mb-[150px] mx-auto max-w-md rounded-2xl bg-white border border-gray-300 overflow-hidden">
    <div className="bg-gradient-to-r from-slate-700 to-slate-500 px-4 py-2">
      <h2 className="text-white text-lg font-semibold tracking-wide">Total Cost</h2>
    </div>
    <table className="w-full text-left border-collapse">
      <tbody>
        <tr className="border-b border-gray-200">
          <td className="px-4 py-2 text-sm font-medium text-gray-700">Chemicals Total</td>
          <td className="px-4 py-2 text-sm font-bold text-indigo-600"> TO-DO</td>
        </tr>
        <tr className="border-b border-gray-200">
          <td className="px-4 py-2 text-sm font-medium text-gray-700">DyeStuffs Total</td>
          <td className="px-4 py-2 text-sm font-bold text-indigo-600">TO-DO</td>
        </tr>
        <tr>
          <td className="px-4 py-2 text-sm font-medium text-gray-700">Chemicals & Dyes Total</td>
          <td className="px-4 py-2 text-sm font-bold text-indigo-600">TO-DO</td>
          </tr>
      </tbody>
    </table>
  </div>
    </div>
  );
});

export default ChemicalTable;
