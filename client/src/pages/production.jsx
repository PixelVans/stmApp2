import { forwardRef } from "react";
import { Database } from "lucide-react";
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
      ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

const ProductionTable = forwardRef((props, ref) => {
  const { steps, loading, error } = useProductionSteps();
  const { selectedWeek, setSelectedWeek } = useDyeingStore();
  const weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen lg:ml-64">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading production data...
        </p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex flex-col mt-[-100px]  items-center justify-center h-screen text-red-600 lg:ml-64">
        <Database className="h-16 w-16 mb-4" />
        <p className="text-xl font-semibold">Database Error</p>
        <p className="mt-2 text-gray-700">
          {error?.message || "The server did not respond. Please try again later."}
        </p>
      </div>
    );
  }

  // Success UI
  return (
    <div ref={ref} className="p-1 sm:p-2 mt-1 bg-white lg:ml-64">
      {/* Dropdown control */}
      <div className="fixed right-0 rounded-md bg-blue-100 mr-7">
        <label className="mr-2 font-medium text-sm p-2 px-4 md:text-base text-gray-800">
          Select Week:
        </label>
        <select
          value={selectedWeek || getISOWeek()}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="rounded-lg bg-blue-200 border-gray-300 text-sm md:text-base font-semibold shadow-sm focus:ring-2
           focus:ring-blue-400 focus:border-blue-400 p-2 px-4"
        >
          {weekNumbers.map((w) => (
            <option key={w} value={w}>
              Week {w}
            </option>
          ))}
        </select>
      </div>

      {/* Render tables */}
      {steps &&
        steps.map((step, sIdx) => (
          <div key={sIdx} className="sm:p-4">
            <h2 className="text-md md:text-lg font-bold">{step.machine}</h2>
            <div className="mt-4">
              <ProductionStepTable rows={step.rows} />
            </div>
          </div>
        ))}
    </div>
  );
});

export default ProductionTable;
