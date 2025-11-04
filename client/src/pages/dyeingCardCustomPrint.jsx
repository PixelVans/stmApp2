import React, { forwardRef } from "react";
import useChemicalSteps from "../hooks/dyeing/useChemicalSteps";
import PrintChemStepTable from "../components/PrintChemStepTable";
import usedyeingSummarySteps from "../hooks/dyeing/usedyeingSummarySteps";
import PrintChemSummaryTable from "../components/PrintChemSummaryTable";
import useDyeingStore from "../store/zustand";
import { getTailwindColor } from "../utils/constants";
import { getTotals } from "../components/functions/dyeingfunc";

const DyeingCardCustomPrint = forwardRef((props, ref) => {
  const steps = useChemicalSteps();
  const summarySteps = usedyeingSummarySteps();
  const {
    scouring,
    selectedColour,
    softener,
    client,
    article,
    lotNo,
    winch,
    dyeingSystem,
    liqRatio8,
    lotWeight,
    saltOption,
    saltPosition,
    soaping,
    liqRatio,
  } = useDyeingStore();

  const totals = getTotals(summarySteps);

  return (
    <div ref={ref} className="p-1 sm:p-2  bg-white text-[10px] leading-tight">
      {/* Header */}
      <div className="border border-gray-300 p-1 px-2 mb-2 rounded text-[11px] text-gray-800">
        <div
          className="
            grid 
            grid-cols-[2.0fr_1.3fr_1.2fr_1.5fr] 
            gap-x-2 gap-y-[2px]
            [&>div]:whitespace-nowrap 
            [&>div]:overflow-hidden 
            [&>div]:text-ellipsis
          "
        >
          <div><strong>Machine:</strong> {winch ?? "-"} @ {liqRatio ?? "-"}</div>
          
           <div><strong>Dyeing System:</strong> {dyeingSystem ?? "-"}</div>
             <div><strong>Salt Position:</strong> {saltPosition ?? "-"}</div>
          <div><strong>Client:</strong> {client ?? "-"}</div>
          
          <div><strong>Shade:</strong> {selectedColour ?? "-"}</div>
          <div><strong>Scouring:</strong> {scouring ?? "-"}</div>
          
          <div><strong>Softener:</strong> {softener ?? "-"}</div>
         <div><strong>Article:</strong> {article ?? "-"}</div>
         
          
          <div><strong>Lot Weight:</strong> {lotWeight ? `${lotWeight} Kgs ` : "-"}</div>
           <div><strong>Salt Option:</strong> {saltOption ?? "-"}</div>
          <div><strong>{liqRatio8 ?? "-"}</strong></div>
         
          <div><strong>Lot Number:</strong> {lotNo ?? "-"}</div>
          
        </div>
      </div>


      {/* Steps */}
      {steps.map((step, sIdx) => (
        <div key={sIdx} className="p-1">
          {step.step === "" && (
            <img
              src="/images/Picture1.png"
              alt="Isotherm"
              className="mb-1 mt-1 h-[118px] mx-auto"
            />
          )}

          {step.step === "Step 5 -  First Rinse" && (
            <h3 className=" text-[10px] mb-2 text-blue-800">
              BAADA YA KUONGEZA MAGADI NA CAUSTIC, DWELL KWA DAKIKA ARUBAINE NA TANO AT 60°C
            </h3>
          )}
          <h2 className="text-[11px] font-bold">{step.step}</h2>
          {step.extraSection && (
            <>
              <h3 className=" text-[9px] mb-1 text-blue-800">
                {step.extraSection.title}
              </h3>
              <div className="mb-2">
                <PrintChemStepTable rows={step.extraSection.rows} />
              </div>
            </>
          )}
          {step.instructions && (
            <p className=" text-[9px] mb-1 text-blue-800">{step.instructions}</p>
          )}
          <div className="mt-1">
            <PrintChemStepTable rows={step.rows} />
          </div>
        </div>
      ))}

      {/* Scouring & Softener Summary */}
      
     {/* Summary Section */}
     <div className="mt-4 mb-4 max-w-xs my-2 mx-auto rounded-lg shadow-md ">
      <h1 className="p-2 text-center  text-[12px] font-semibold tracking-wide">
        Summary
      </h1>
    </div>



      <div className="p-1 text-[9px]">
        <PrintChemSummaryTable steps={summarySteps} />
      </div>


      {/* Totals Section */}
      <div className="mt-4 mx-auto max-w-sm rounded-lg bg-white border border-gray-300 overflow-hidden text-[12px]">
        <div className="bg-gradient-to-r from-slate-800 to-slate-500 px-1 py-1.5 flex items-center">
          <h2 className="text-white ml-4 text-[13px] font-semibold tracking-wide">Total Cost</h2>
        </div>
        <table className="w-full ml-4 my-1 text-left border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-1 py-0.5 font-medium text-gray-700">Chemicals Totals</td>
              <td className="px-1 py-0.5 font-bold">Ksh {totals.chemicalsTotal}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-1 py-0.5 font-medium text-gray-700">Dyestuffs Total</td>
              <td className="px-1 py-0.5 font-bold">Ksh {totals.dyestuffsTotal}</td>
            </tr>
            <tr>
              <td className="px-1 py-0.5 font-medium text-gray-700">Chemicals & Dyes Total</td>
              <td className="px-1 py-0.5 font-bold">Ksh {totals.chemicalsAndDyesTotal}</td>
            </tr>
            <tr className="hidden">
              <td className="px-1 py-0.5 font-medium text-gray-700">Needed Totals</td>
              <td className="px-1 py-0.5 font-bold">Ksh {totals.totalsNeeded}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default DyeingCardCustomPrint;
