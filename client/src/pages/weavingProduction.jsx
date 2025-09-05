import { forwardRef, useEffect, useState } from "react";
import { Server } from "lucide-react";
import useProductionSteps from "../hooks/production/useProductionSteps";
import ProductionStepTable from "../components/ProductionStepTable";
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

const WeavingProductionTable = forwardRef((props, ref) => {
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
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen lg:ml-64">
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
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen text-red-600 lg:ml-64">
        <Server className="h-16 w-16 mb-4" />
        <p className="text-xl font-semibold">Server Error</p>
        <p className="mt-2 text-gray-700">
          {"The server did not respond. Please try again later."}
        </p>
      </div>
    );
  }

  
  return (
    <div ref={ref} className="p-1 sm:p-2  bg-white lg:ml-64 mt-9">
      <h1 className="mx-auto text-center font-semibold">
        Weaving Production for Week {selectedWeek}
      </h1>

      {/* Dropdown control */}
      <div className="fixed right-0 rounded-md bg-blue-100 mr-7 top-20">
        <label className="mr-2 font-medium text-sm p-2 px-4 md:text-base text-gray-800">
          Select Week:
        </label>
        <select
          value={selectedWeek || getISOWeek()}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="rounded-lg bg-green-100 border-gray-300 text-sm md:text-base font-semibold shadow-sm focus:ring-2
           focus:ring-blue-400 focus:border-blue-400 p-2 px-6"
        >
          {weekNumbers.map((w) => (
            <option key={w} value={w}>
              Week {w}
            </option>
          ))}
        </select>
      </div>

   
      {/* {steps && (
        <div className="sm:p-4">
          <ProductionStepTable
            rows={steps.flatMap((step) => [
              { isTitle: true, prodInfo: step.machine }, // title row
              ...step.rows,
            ])}
          />
        </div>
      )} */}


   {steps &&
        steps.map((step, sIdx) => (
          <div key={sIdx} className="sm:p-">
            {step.machine && (
              <h2 className="text-md md:text-lg font-bold">{step.machine}</h2>
            )}
            <div className="mb-4">
              <ProductionStepTable rows={step.rows} />
            </div>
          </div>
        ))}


      {/* Render summary */}
     {summary && (
        <div className="mb-5 max-w-3xl mx-auto">
          
          <table className="table-auto border-collapse border border-gray-700 w-full text-[9px] 
            sm:text-[9px] md:text-xs lg:text-sm text-center">
            <thead>
              <tr className="bg-gray-200 ">
                <th className="border border-gray-700 p-1 font-medium">Average A</th>
                <th className="border border-gray-700 p-1 font-medium">Average B</th>
                <th className="border border-gray-700 p-1 font-medium">Weekly Total A</th>
                <th className="border border-gray-700 p-1 font-medium">Weekly Total B</th>
                <th className="border border-gray-700 p-1 font-medium">Weekly Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border border-gray-700 p-1">
                  {summary.avgA.toLocaleString()}
                </td>
                <td className="border border-gray-700 p-1">
                  {summary.avgB.toLocaleString()}
                </td>
                <td className="border border-gray-700 p-1">
                  {summary.weeklyA.toLocaleString()}
                </td>
                <td className="border border-gray-700 p-1">
                  {summary.weeklyB.toLocaleString()}
                </td>
                <td className="border border-gray-700 p-1">
                  {summary.weeklyTotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
});

export default WeavingProductionTable;
