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
    <div ref={ref} className="p-1 bg-white text-[10px] leading-tight">
      {/* Header Info */}
      <div className="border border-gray-300 p-1 mb-2 rounded text-[9px] text-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-0.5">
          <div><strong>Client:</strong> {client ?? "-"}</div>
          <div><strong>Lot No:</strong> {lotNo ?? "-"}</div>
          <div><strong>Article:</strong> {article ?? "-"}</div>
          <div><strong>Winch:</strong> {winch ?? "-"}</div>
          <div><strong>Dyeing System:</strong> {dyeingSystem ?? "-"}</div>
          <div>
            <strong>Shade:</strong>{" "}
            <span className={getTailwindColor(selectedColour)}>
              {selectedColour ?? "-"}
            </span>
          </div>
          <div><strong>Scouring:</strong> {scouring ?? "-"}</div>
          <div><strong>Softener:</strong> {softener ?? "-"}</div>
          <div><strong>Liq. Ratio:</strong> {liqRatio ?? "-"}</div>
          <div><strong>Dye-Fix:</strong> {liqRatio8 ?? "-"}</div>
          <div><strong>Lot Weight:</strong> {lotWeight ? `${lotWeight} Kgs` : "-"}</div>
          <div><strong>Salt Option:</strong> {saltOption ?? "-"}</div>
          <div><strong>Salt Position:</strong> {saltPosition ?? "-"}</div>
          <div><strong>Soaping:</strong> {soaping ?? "-"}</div>
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, sIdx) => (
        <div key={sIdx} className="p-1">
          {step.step === "" && (
            <img
              src="/images/Picture1.png"
              alt="Process illustration"
              className="mb-2 mt-2 h-[150px] mx-auto"
            />
          )}

          {step.step === "Step 5 -  First Rinse" && (
            <h3 className="italic text-[9px] mb-1 text-blue-600">
              BAADA YA KUONGEZA MAGADI NA CAUSTIC, DWELL KWA DAKIKA ARUBAINE NA TANO AT 60°C
            </h3>
          )}
          <h2 className="text-[11px] font-bold">{step.step}</h2>
          {step.extraSection && (
            <>
              <h3 className="italic text-[9px] mb-1 text-blue-600">
                {step.extraSection.title}
              </h3>
              <div className="mb-2">
                <PrintChemStepTable rows={step.extraSection.rows} />
              </div>
            </>
          )}
          {step.instructions && (
            <p className="italic text-[9px] mb-1 text-blue-600">{step.instructions}</p>
          )}
          <div className="mt-2">
            <PrintChemStepTable rows={step.rows} />
          </div>
        </div>
      ))}

      {/* Scouring & Softener Summary */}
      
        <h1 className="p-1 text-center mx-auto text-[10px] font-semibold">Summary</h1>
      

      {/* Summary Steps */}
      {summarySteps.map((step, sIdx) => (
        <div key={sIdx} className="p-1 ">
          <h2 className="text-[10px]">{step.step}</h2>
          <div className="text-[9px]">
            <PrintChemSummaryTable rows={step.rows} />
          </div>
        </div>
      ))}

      {/* Totals Section */}
      <div className="mt-2 mx-auto max-w-sm rounded-lg bg-white border border-gray-300 overflow-hidden text-[9px]">
        <div className="bg-gradient-to-r from-slate-800 to-slate-400 px-1 py-0.5">
          <h2 className="text-white text-[10px] font-semibold tracking-wide">Total Cost</h2>
        </div>
        <table className="w-full text-left border-collapse">
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
