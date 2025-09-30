"use client";

import { forwardRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// Utility to format today's date
const formatDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-GB"); 
};

const DyestuffsStockPrintoutPage = forwardRef((props, ref) => {
const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch dyestuffs
  const fetchDyestuffs = async () => {
    setError(false);
    try {
      const res = await fetch("/api/dyestuffs-stock");
      if (!res.ok) throw new Error("Failed to fetch dyestuffs");
      const data = await res.json();

      // Sort numerically by DyestuffsIndex
      let sorted = [...data].sort(
        (a, b) => a.DyestuffsIndex - b.DyestuffsIndex
      );

      setRows(sorted);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Load Dyestuffs on mount
  useEffect(() => {
    fetchDyestuffs();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-48">
        <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading Dyestuffs Stock Data...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-36 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-gray-700 font-medium mb-2">
          Failed to load Dyestuffs Stock Data.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          The server did not respond or returned no data.
        </p>
        <Button onClick={fetchDyestuffs} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
    ref={ref}
    className="p-6 bg-white text-black max-w-[794px] mx-auto">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="font-semibold text-xl text-blue-900">
          Dyestuffs Stock Report
        </h2>
        <p className="text-sm p-2 text-gray-600">As of {formatDate()}</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border border-gray-600 px-2 py-1 text-center w-96">
                Item Description
              </th>
              <th className="border border-gray-600 px-2 py-1 text-center w-40">
                Current Stock
              </th>
              <th className="border border-gray-600 px-2 py-1 text-center w-32">
                In
              </th>
              <th className="border border-gray-600 px-2 py-1 text-center w-32">
                Out
              </th>
              <th className="border border-gray-600 px-2 py-1 text-center w-32">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.ID || i}>
                <td className="border border-gray-600 px-2 py-0">
                  {row.Description}
                </td>
                <td className="border border-gray-600 px-2 py-0 text-center">
                  {row.QuantityonHand}
                </td>
                <td className="border border-gray-600 px-2 py-0 text-center">
                  {row.in || ""}
                </td>
                <td className="border border-gray-600 px-2 py-0 text-center">
                  {row.out || ""}
                </td>
                <td className="border border-gray-600 px-2 py-0 text-center">
                  {row.balance || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
})
export default DyestuffsStockPrintoutPage;
  

