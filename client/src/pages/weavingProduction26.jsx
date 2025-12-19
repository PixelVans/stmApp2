import { forwardRef, useRef } from "react";
import { Server, Database } from "lucide-react";
import useProductionSteps26 from "../hooks/production/useProductionSteps26";
import ProductionStepTable26 from "../components/ProductionStepTable26";
import useDyeingStore from "../store/zustand";
import WeavingProductionPrintout26 from "../customPrintouts/weavingProductionPrintout26";
import { useReactToPrint } from "react-to-print";
import { FiPrinter } from "react-icons/fi";


/* = HELPERS== */
function getISOWeek(date = new Date()) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);

  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);

  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

const weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  return new Date().getFullYear() - i;
});

/* === CONTROL PANEL === */
function ControlPanel({
  selectedWeek,
  setSelectedWeek,
  selectedYear,
  setSelectedYear,
  onPrint,
}) {
  return (
    <div
      className="fixed top-16 right-5 left-5 bg-blue-100 rounded-b-md shadow-md px-4 py-3 
      flex items-center justify-between gap-3 z-30 lg:ml-[270px]"
    >
      {/* WEEK + YEAR */}
      <div className="flex items-center gap-3">
      

        {/* YEAR */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-lg bg-yellow-100 border-gray-300 text-sm font-semibold shadow-sm 
            focus:ring-2 focus:ring-blue-400 px-3 lg:px-6 py-2 w-28"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

          {/* WEEK */}
        <select
          value={selectedWeek || getISOWeek()}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="rounded-lg bg-green-100 border-gray-300 text-sm font-semibold shadow-sm 
            focus:ring-2 focus:ring-blue-400 px-3 lg:px-6 py-2 w-32"
        >
          {weekNumbers.map((w) => (
            <option key={w} value={w}>
              Week {w}
            </option>
          ))}
        </select>
        </div>

      {/* PRINT */}
      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg 
          hover:bg-indigo-600 transition text-sm"
      >
        <FiPrinter className="w-4 h-4" />
        Print Document
      </button>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
const WeavingProductionTable26 = forwardRef((props, ref) => {
  const { steps, summary, loading, error, empty } = useProductionSteps26();

  const {
    selectedWeek,
    setSelectedWeek,
    selectedYear,
    setSelectedYear,
  } = useDyeingStore();

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: ".",
    pageStyle: `
      @page { size: A4 landscape; }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `,
  });

  return (
    <div ref={ref} className="bg-white">
      {/* CONTROL PANEL */}
      <ControlPanel
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onPrint={handlePrint}
      />

      <div className="pt-28 px-2 sm:px-4">
        {/* LOADING */}
        {loading && (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white">
        <div className="flex space-x-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-[2px] h-5 bg-blue-500 rounded animate-[wave_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.5}s` }}
            ></div>
          ))}
        </div>

        <p className="mt-6 text-sm  text-gray-800">
          Loading Weaving Production Data...
        </p>

        <style>{`
          @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); } 
            20% { transform: scaleY(1.0); }
          }
        `}</style>
      </div>
    
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-red-600">
            <Server className="h-10 w-10 mb-4" />
            <p className="font-semibold">Server Error</p>
          </div>
        )}

        
        {/* EMPTY STATE */} 
        {!loading && !error && empty && ( <div className="flex flex-col items-center justify-center h-[50vh]">
           <Database className="h-10 w-10 mb-4 text-blue-400" /> 
           <p className="text-xl font-semibold">No Production Data</p> 
        <p className="mt-2 text-gray-600 text-center max-w-sm">
           No weaving production was recorded for the selected week/year. </p> </div> )}

        {/* DATA */}
        {!loading && !error && !empty && (
          <>
            <h1 className="text-center font-semibold ">
              Weaving Production for Week {selectedWeek}, {selectedYear}
            </h1>

            {steps?.map((step, idx) => (
              <div key={idx} className="mt-3">
                {step.machine && (
                  <h2 className="font-semibold text-sm">{step.machine}</h2>
                )}
                <ProductionStepTable26 rows={step.rows} />
              </div>
            ))}

            {summary && (
              <div className="mt-5 flex justify-center">
                <table className="border text-xs text-center">
                  <tbody>
                    <tr>
                      <td className="border p-1">{summary.weeklyTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* PRINT */}
      <div className="absolute -left-[9999px] top-0">
        <WeavingProductionPrintout26 ref={componentRef} />
      </div>
    </div>
  );
});

export default WeavingProductionTable26;
