import { forwardRef, useEffect, useState } from "react";
import useChemicalSteps from "../hooks/dyeing/useChemicalSteps";
import ChemicalStepTable from "../components/ChemicalStepTable";
import usedyeingSummarySteps from "../hooks/dyeing/usedyeingSummarySteps";
import ChemicalSummaryTable from "../components/ChemicalSummaryTable";
import useDyeingStore from "../store/zustand";
import { getTotals } from "../components/functions/dyeingfunc";

const ChemicalTable = forwardRef((props, ref) => {
  const steps = useChemicalSteps();
  const summarySteps = usedyeingSummarySteps();
  const { scouring, softener } = useDyeingStore();
  const totals = getTotals(summarySteps);

  const [isFetching, setIsFetching] = useState(false);
  const [seconds, setSeconds] = useState(0);

  //  Timer (optional, like your weaving page)
  useEffect(() => {
    let timer;
    if (isFetching) {
      setSeconds(0);
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isFetching]);

  // 🔍 Detect "fetching" anywhere in the component
  useEffect(() => {
    const el = document.body;
    if (!el) return;

    const checkForFetchingText = () => {
  const text = el.innerText.toLowerCase();
  const hasFetching =
    text.includes("fetching..") || text.includes("fetching data");
  setIsFetching(hasFetching);
};




    // Run once immediately
    checkForFetchingText();

    // Watch DOM for updates
    const observer = new MutationObserver(checkForFetchingText);
    observer.observe(el, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  // 🌐 Full-page loading overlay (like Weaving)
  if (isFetching) {
    return (
      <div className="flex flex-col mt-[-220px] items-center justify-center h-screen bg-white">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-6 bg-blue-500 rounded animate-[wave_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        <p className="mt-6 text-lg font-semibold text-gray-800">
          Loading Dyeing Data
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Timeout <span className="font-semibold">{seconds}</span> sec
          {seconds !== 1 ? "s" : ""}
        </p>

        <style>{`
          @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); } 
            20% { transform: scaleY(1.0); }
          }
        `}</style>
      </div>
);


  }

  // Normal page content once no "fetching" text
  return (
    <div ref={ref} className="p-1 sm:p-2 bg-white">
      {steps.map((step, sIdx) => (
        <div key={sIdx} className="sm:p-4">
          {step.step === "" && (
            <img
              src="/images/Picture1.png"
              alt="Process illustration"
              className="mb-5 mt-5 w-auto mx-auto"
            />
          )}

          {step.step === "Step 5 -  First Rinse" && (
            <h3 className="italic text-sm my-3 text-blue-600">
              BAADA YA KUONGEZA MAGADI NA CAUSTIC, DWELL KWA DAKIKA ARUBAINE NA
              TANO AT 60°C
            </h3>
          )}

          <h2 className="text-md md:text-lg font-bold mt-5">{step.step}</h2>

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
            <p className="italic text-sm mb-2 text-blue-600">
              {step.instructions}
            </p>
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
              <td className="px-4 py-2 text-sm font-medium text-gray-700">
                Scouring System Selected
              </td>
              <td className="px-4 py-2 text-sm font-bold text-indigo-600">
                {scouring}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-sm font-medium text-gray-700">
                Softener Selected
              </td>
              <td className="px-4 py-2 text-sm font-bold text-indigo-600">
                {softener}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Unified Summary Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-center">
          <thead>
            <tr className="bg-gray-300 border text-center">
              <th className="border border-gray-600 px-2 py-1 w-40">
                Chemicals Summary
              </th>
              <th className="border border-gray-600 px-2 py-1 w-32">Kgs Needed</th>
              <th className="border border-gray-600 px-2 py-1 w-32">Amt on Hand</th>
              <th className="border border-gray-600 px-2 py-1 w-32">Summary</th>
              <th className="border border-gray-600 px-2 py-1 w-32">Kg/Lt Cost</th>
              <th className="border border-gray-600 px-2 py-1 w-32">Total Cost</th>
              <th className="border border-gray-600 px-2 py-1 hidden">Needed Totals</th>
            </tr>
          </thead>
          <tbody>
            {summarySteps.map((step, sIdx) => (
              <ChemicalSummaryTable
                key={sIdx}
                stepTitle={step.step}
                rows={step.rows}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-5 mx-auto mb-15 max-w-md rounded-2xl bg-white border border-gray-300 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-400 px-4 py-2">
          <h2 className="text-white ml-4 text-lg font-semibold tracking-wide">
            Total Cost
          </h2>
        </div>
        <table className="w-full ml-4 text-left border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 text-sm font-medium text-gray-700">
                Chemicals Totals
              </td>
              <td className="px-4 py-2 text-sm font-bold">
                Ksh {totals.chemicalsTotal}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 text-sm font-medium text-gray-700">
                Dyestuffs Total
              </td>
              <td className="px-4 py-2 text-sm font-bold">
                Ksh {totals.dyestuffsTotal}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-sm font-medium text-gray-700">
                Chemicals & Dyes Total
              </td>
              <td className="px-4 py-2 text-sm font-bold">
                Ksh {totals.chemicalsAndDyesTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ChemicalTable;
