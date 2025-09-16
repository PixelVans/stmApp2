import { forwardRef, useEffect, useRef, useState } from "react";
import { Server } from "lucide-react";
import useProductionSteps from "../hooks/production/useProductionSteps";
import ProductionStepTable from "../components/ProductionStepTable";
import useDyeingStore from "../store/zustand";
import WeavingProductionPrintout from "../customPrintouts/weavingProductionPrintout";  
import { useReactToPrint } from "react-to-print";
import { FiPrinter } from "react-icons/fi";
import WeavingReportFormModal from "../components/forms/WeavingReportFormModal";

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


const WeavingProductionTable = forwardRef((props, ref) => {

  const { steps, summary, loading, error } = useProductionSteps();
  const { selectedWeek, setSelectedWeek } = useDyeingStore();
  const weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
  const [seconds, setSeconds] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // LOading Helper 
  useEffect(() => {
    if (!loading) return;
    setSeconds(0);

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  // react to print
const componentRef = useRef(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef, 
  documentTitle: ".",
  pageStyle: `
    @page {
      size: A4 landscape;
     }
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  `,
});



  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen ">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading Weaving production Data
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Waiting for <span className="font-semibold">{seconds}</span> sec
          {seconds !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen text-red-600">
        <Server className="h-16 w-16 mb-4" />
        <p className="text-xl font-semibold">Server Error</p>
        <p className="mt-2 text-gray-700">
          {"The server did not respond. Please try again later."}
        </p>
      </div>
    );
  }

  
  return (
  <div ref={ref} className="p-1 sm:p-2 lg:p-4  bg-white  mt-20 md:mt-9"> 

 {/* control panel */}
<div className="fixed top-16 right-5 left-5 bg-blue-100 rounded-b-md shadow-md px-4 py-3 
  flex flex-col  sm:flex-row items-center justify-between gap-3 z-30 lg:ml-[270px]">

  {/* Dropdown control */}
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <label className="font-medium hidden lg:block text-gray-700 text-md sm:text-base whitespace-nowrap ">
      Select Week:
    </label>
    <select
      value={selectedWeek || getISOWeek()}
      onChange={(e) => setSelectedWeek(Number(e.target.value))}
      className="rounded-lg bg-green-100 border-gray-300 text-sm sm:text-base font-semibold shadow-sm 
        focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-3 py-2 w-44 sm:w-44 "
    >
      {weekNumbers.map((w) => (
        <option key={w} value={w}>
          Week {w}
        </option>
      ))}
    </select>
  </div>

  {/* Action buttons */}
  <div className="flex gap-2 sm:gap-4 ml-5 sm:ml-0">
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm text-sm sm:text-base font-medium
       hover:bg-blue-700 transition"
    >
      Print Document
    </button>
    <button
     onClick={handlePrint}
     className=" items-center hidden  gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
     >
      <FiPrinter className="w-4 h-4" />
       Print Document
    </button>

    <div className="absolute -left-[9999px] top-0">
      <WeavingProductionPrintout ref={componentRef} />
     </div>
  </div>
  </div>


      <h1 className="mx-auto text-center font-semibold mt-10 text-xs sm:text-lg">
        Weaving Production for Week {selectedWeek}
      </h1>
     
      {steps &&
        steps.map((step, sIdx) => (
          <div key={sIdx} className="mt-2">
            {step.machine && (
              <h2 className="text-xs sm:text-sm  sm:font-semibold">{step.machine}</h2>
            )}
            <div className="mb-4 ">
              <ProductionStepTable rows={step.rows} />
            </div>
          </div>
        ))}

    {summary && (
      <div className="mb-5 flex justify-center">
        <table className="table-auto border-collapse border border-gray-700 text-[5px] 
          sm:text-[9px] md:text-xs lg:text-sm text-center ">
          <thead>
            <tr className="bg-gray-200 text-[5px] sm:text-[12px]">
              <th className="border border-gray-600 p-1 font-medium w-40">Average A</th>
              <th className="border border-gray-600 p-1 font-medium w-40">Average B</th>
              <th className="border border-gray-600 p-1 font-medium w-40">Weekly Total A</th>
              <th className="border border-gray-600 p-1 font-medium w-40">Weekly Total B</th>
              <th className="border border-gray-600 p-1 font-medium w-40">Weekly Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center ">
              <td className="border border-gray-600 p-1">{summary.avgA.toLocaleString()}</td>
              <td className="border border-gray-600 p-1">{summary.avgB.toLocaleString()}</td>
              <td className="border border-gray-600 p-1">{summary.weeklyA.toLocaleString()}</td>
              <td className="border border-gray-600 p-1">{summary.weeklyB.toLocaleString()}</td>
              <td className="border border-gray-600 p-1 ">{summary.weeklyTotal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )}
    
    {/* report form  */}
    <WeavingReportFormModal open={modalOpen} onClose={() => setModalOpen(false)} />

    </div>
  );
});

export default WeavingProductionTable;
