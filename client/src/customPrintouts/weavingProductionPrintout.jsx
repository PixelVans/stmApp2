import { forwardRef, useEffect, useState } from "react";
import { Server } from "lucide-react";
import useProductionSteps from "../hooks/production/useProductionSteps";

import PrintingProductionStepTable from "../components/PrintoutTables/PrintingProductionStepTable";
import useDyeingStore from "../store/zustand";

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

const WeavingProductionPrintout = forwardRef((props, ref) => {
  const { steps, summary, loading, error } = useProductionSteps();
  const { selectedWeek, setSelectedWeek } = useDyeingStore();
  const weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setSeconds(0);

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading Weaving production for week {selectedWeek}
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
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen text-red-600 ">
        <Server className="h-16 w-16 mb-4" />
        <p className="text-xl font-semibold">Server Error</p>
        <p className="mt-2 text-gray-700">
          {"The server did not respond. Please try again later."}
        </p>
      </div>
    );
  }

  
  return (
    <div ref={ref} className="p-  bg-white">
      <h1 className="mx-auto text-center mb-2 text-sm font-semibold">
        Weaving Production Sheet for Week {selectedWeek}
      </h1>

      
  

   
      {steps && (
        <div className="p-2">
          <PrintingProductionStepTable
            rows={steps.flatMap((step) => [
              { isTitle: true, prodInfo: step.machine }, 
              ...step.rows,
            ])}
          />
        </div>
      )}


   

   {/* Render summary */}
  {summary && (
  <div className="mb-5 flex justify-center">
    <table className="table-auto border-collapse border border-gray-700 text-[9px] 
      sm:text-[9px] md:text-xs lg:text-sm text-center ">
      <thead>
        <tr className="bg-gray-300 text-[9px] ">
          <th className="border border-gray-600 p-[1px] font-medium w-40">Average A</th>
          <th className="border border-gray-600 p-[1px] font-medium w-40">Average B</th>
          <th className="border border-gray-600 p-[1px] font-medium w-40">Weekly Total A</th>
          <th className="border border-gray-600 p-[1px] font-medium w-40">Weekly Total B</th>
          <th className="border border-gray-600 p-[1px] font-medium w-40">Weekly Total</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center text-[9px] font-bold">
          <td className="border border-gray-600 p-">{summary.avgA.toLocaleString()}</td>
          <td className="border border-gray-600 p-">{summary.avgB.toLocaleString()}</td>
          <td className="border border-gray-600 p-">{summary.weeklyA.toLocaleString()}</td>
          <td className="border border-gray-600 p-">{summary.weeklyB.toLocaleString()}</td>
          <td className="border border-gray-600 p- ">{summary.weeklyTotal.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}


    </div>
  );
});

export default WeavingProductionPrintout;
