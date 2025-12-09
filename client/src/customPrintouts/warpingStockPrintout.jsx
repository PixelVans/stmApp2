"use client";

import { forwardRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// Utility to format today's date
const formatDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-GB");
};

const WarpingStockPrintoutPage = forwardRef(({ refreshKey }, ref) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch warping stock
  const fetchWarpingStock = async () => {
    setError(false);
    try {
      const res = await fetch("/api/warping-stock");
      if (!res.ok) throw new Error("Failed to fetch warping stock");
      const data = await res.json();

      // Sort so Yarn appears first, then others by StockIndex
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

    useEffect(() => {
    fetchWarpingStock();
  }, [refreshKey]);

  useEffect(() => {
    fetchWarpingStock();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-48">
        <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading Warping Stock Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-36 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-gray-700 font-medium mb-2">
          Failed to load Warping Stock Data.
        </p>
        <Button onClick={fetchWarpingStock} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div ref={ref} className="p-6 bg-white text-black max-w-[794px] mx-auto mt-5">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="font-semibold text-xl text-blue-900">
          Yarn Stock Report
        </h2>
        <p className="text-sm p-2 text-gray-600"> <span className="italic mr-2">As of</span> {formatDate()}</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border border-gray-600 px-2 py-1 text-center w-28">
                Type
              </th>
              <th className="border border-gray-600 px-2 py-1 text-center">
                Item Description
              </th>
              <th className="border border-gray-600 px-2 py-1 text-center w-32">
                Current Stock
              </th>
              <th className="border border-gray-600 px-2 py-1 text-center w-24">
                Unit
              </th>
            </tr>
          </thead>
          <tbody>
        {/* Yarn rows first */}
        {rows
          .filter((r) => r.Type?.toLowerCase() === "yarn")
          .map((row, i) => (
            <tr key={row.ID || i}>
              <td className="border border-gray-600 px-2 py-1 text-center font-medium">
                {row.Type || "-"}
              </td>
              <td className="border border-gray-600 px-2 py-1 text-center w-40">
                {row.Description}
              </td>
              <td className="border border-gray-600 px-2 py-1 text-center">
                {row.QuantityOnHand}
              </td>
              <td className="border border-gray-600 px-2 py-1 text-center">
                {row.UnitOfMeasure || "-"}
              </td>
            </tr>
          ))}

        {/* Divider after yarns */}
            {rows.some((r) => r.Type?.toLowerCase() !== "yarn") && (
              <tr>
                <td colSpan={4} className="h-14"></td>
              </tr>
            )}

            {/* Non-yarn (other) rows */}
            {rows
              .filter((r) => r.Type?.toLowerCase() !== "yarn")
              .map((row, i) => (
                <tr key={row.ID || i}>
                  <td className="border border-gray-600 px-2 py-1 text-center font-medium">
                    {row.Type || "-"}
                  </td>
                  <td className="border border-gray-600 px-2 py-1 text-center w-40">
                    {row.Description}
                  </td>
                  <td className="border border-gray-600 px-2 py-1 text-center">
                    {row.QuantityOnHand}
                  </td>
                  <td className="border border-gray-600 px-2 py-1 text-center">
                    {row.UnitOfMeasure || "-"}
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>
    </div>
  );
});

export default WarpingStockPrintoutPage;
