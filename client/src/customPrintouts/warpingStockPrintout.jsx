
"use client";

import { forwardRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const formatDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-GB");
};

const WarpingStockPrintoutPage = forwardRef(({ refreshKey }, ref) => {
  const [rows, setRows] = useState([]);
  const [recentWarping, setRecentWarping] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWarpingStock = async () => {
    setError(false);
    try {
      const res = await fetch("/api/warping-stock");
      if (!res.ok) throw new Error("Failed to fetch warping stock");
      const data = await res.json();

      const sorted = [...data].sort((a, b) => {
        const isYarnA = a.Type?.toLowerCase() === "yarn";
        const isYarnB = b.Type?.toLowerCase() === "yarn";
        if (isYarnA && !isYarnB) return -1;
        if (!isYarnA && isYarnB) return 1;
        return (a.StockIndex || 0) - (b.StockIndex || 0);
      });

      setRows(sorted);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentWarping = async () => {
    try {
      const res = await fetch("/api/weaving-production/warp/latest");
      if (!res.ok) throw new Error("Failed to fetch warping history");
      const data = await res.json();
      console.log('fetchedRecentWarping data',data)
      const merged = data.map((row) => ({
        ...row,
        YarnCombined: [row.YarnCount1, row.YarnCount2].filter(Boolean).join(" | ")
      }));
    
      setRecentWarping(merged);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWarpingStock();
    fetchRecentWarping();
  }, [refreshKey]);

  useEffect(() => {
    fetchWarpingStock();
    fetchRecentWarping();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-48">
        <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">Loading Warping Stock Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-36 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-gray-700 font-medium mb-2">Failed to load Warping Stock Data.</p>
        <Button onClick={fetchWarpingStock} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div ref={ref} className="p-6 bg-white text-black max-w-[794px] mx-auto mt-5">
      <div className="text-center mb-2">
        <h2 className="font-semibold text-xl text-blue-900">Yarn Stock Report</h2>
        <p className="text-sm p-2 text-gray-600"><span className="italic mr-2">As of</span>{formatDate()}</p>
      </div>

      <div className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border border-gray-600 px-2 py-1 text-center w-28">Type</th>
              <th className="border border-gray-600 px-2 py-1 text-center">Item Description</th>
              <th className="border border-gray-600 px-2 py-1 text-center w-32">Current Stock</th>
              <th className="border border-gray-600 px-2 py-1 text-center w-24">Unit</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(r => r.Type?.toLowerCase() === "yarn").map((row, i) => (
              <tr key={row.ID || i}>
                <td className="border border-gray-600 px-2 py-1 text-center font-medium">{row.Type}</td>
                <td className="border border-gray-600 px-2 py-1 text-center w-40">{row.Description}</td>
                <td className="border border-gray-600 px-2 py-1 text-center">{row.QuantityOnHand}</td>
                <td className="border border-gray-600 px-2 py-1 text-center">{row.UnitOfMeasure}</td>
              </tr>
            ))}

            {rows.some(r => r.Type?.toLowerCase() !== "yarn") && (
              <tr><td colSpan={4} className="h-14"></td></tr>
            )}

            {rows.filter(r => r.Type?.toLowerCase() !== "yarn").map((row, i) => (
              <tr key={row.ID || i}>
                <td className="border border-gray-600 px-2 py-1 text-center font-medium">{row.Type}</td>
                <td className="border border-gray-600 px-2 py-1 text-center w-40">{row.Description}</td>
                <td className="border border-gray-600 px-2 py-1 text-center">{row.QuantityOnHand}</td>
                <td className="border border-gray-600 px-2 py-1 text-center">{row.UnitOfMeasure}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-20">
        <h3 className="text-sm text-blue-900 text-center mb-3">
  Warping Output – Recent Records
</h3>


  <table className="w-full border-collapse text-xs">
    <thead className="bg-slate-200">
      <tr>
        <th className="border border-gray-600 px-1 py-1 text-center">Beam No.</th>
        <th className="border border-gray-600 px-1 py-1 text-center">Article</th>
        <th className="border border-gray-600 px-1 py-1 text-center">Yarn 1</th>
        <th className="border border-gray-600 px-1 py-1 text-center">Yarn 2</th>
        <th className="border border-gray-600 px-1 py-1 text-center">Knotting C.</th>
        <th className="border border-gray-600 px-1 py-1 text-center">Meters</th>
        <th className="border border-gray-600 px-1 py-1 text-center">Machine</th>
        <th className="border border-gray-600 px-1 py-1 text-center">Date</th>
      </tr>
    </thead>

    <tbody>
      {recentWarping.map((row, i) => (
        <tr key={row.ID || i}>
          <td className="border border-gray-600 px-1 py-1 text-center">{row.BeamNumber}</td>
          <td className="border border-gray-600 px-1 py-1 text-center">{row.Article}</td>

          {/* Yarn 1 column */}
          <td className="border border-gray-600 px-1 py-1 text-center">
          <div className="flex mx-auto gap-1 w-full items-center justify center">
            <span className="font-medium  text-left">{row.Yarn1 ? row.Yarn1 : "-"}</span>
            <span className="text-left text-xs">{row.Yarn1 ? `@ ${Number(row.WeightofYarn1).toFixed(0) || 0} kg` : ""}</span>
          </div>
        </td>


          {/* Yarn 2 column */}
          <td className="border border-gray-600 px-1 py-1 text-center">
            <div className="flex mx-auto gap-1 w-full items-center justify center">
              <span className="font-medium text-left">{row.Yarn2 ? row.Yarn2 : "-"}</span>
              <span className="text-left text-xs">{row.Yarn2 ? `@ ${Number(row.WeightofYarn2).toFixed(0) || 0} kg` : ""}</span>
            </div>
          </td>


          <td
            className={`border border-gray-600 px-1 py-1 text-center ${
              !row.KnottingCounter || row.KnottingCounter === 0 ? "bg-yellow-400 text-white" : ""
            }`}
          >
            {row.KnottingCounter && row.KnottingCounter > 0 ? row.KnottingCounter : ""}
          </td>



          <td className="border border-gray-600 px-1 py-1 text-center">{row.Meters}</td>
          <td className="border border-gray-600 px-1 py-1 ">
            <div className='flex mx-auto gap-1 w-full items-center justify center'>
            
              <span className="font-medium ml-1 text-left  "> {row.MachineNumber ? `${row.MachineNumber} -` : '-' }</span>
              <span className='text-left text-xs ' > {row.BeamPosition ? row.BeamPosition  : "" }</span>
            </div>
             
          </td>

          <td className="border border-gray-600 px-1 py-1 text-center">
            {new Date(row.Date).toLocaleDateString("en-GB")}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
        </div>
      </div>
    </div>
  );
});

export default WarpingStockPrintoutPage;
