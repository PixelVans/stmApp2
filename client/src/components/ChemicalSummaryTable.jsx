import React from "react";

export default function ChemicalSummaryTable({ rows }) {
  const NBSP = "\u00A0";

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1 text-left">Chemicals Summary</th>
          <th className="border px-2 py-1 text-right">Kgs Needed</th>
          <th className="border px-2 py-1 text-left">Amt on Hand</th>
          <th className="border px-2 py-1 text-left">Summary</th>
          <th className="border px-2 py-1 text-left">Kg/lt Cost</th>
          <th className="border px-2 py-1 text-left">Total Cost</th>
          <th className="border px-2 py-1 text-left">Needed Totals</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const chemText = (r.chemical || "").toString().toUpperCase().trim();
          const isInstructionRow =
            !!r.isInstructionRow ||
            chemText.includes("REMAIN IN DWELL") ||
            chemText.includes("WAIT FOR") ||
            chemText === "E" ||
            chemText.includes("20 MIN");

          if (isInstructionRow) {
            return (
              <tr key={i}>
                <td colSpan={6} className="border p-0">
                  <div className="bg-yellow-200 h-12 w-full flex items-center justify-center font-bold">
                    {r.chemical || NBSP}
                  </div>
                </td>
              </tr>
            );
          }

          return (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border px-2 py-1">{r.chemical || NBSP}</td>
              <td className="border px-2 py-1 text-right">
                {r.gramsPerLt || NBSP}
              </td>
              <td className="border px-2 py-1">{r.amount || NBSP}</td>
              <td className="border px-2 py-1">{r.temp || NBSP}</td>
              <td className="border px-2 py-1">{r.time || NBSP}</td>
              <td className="border px-2 py-1">{r.ph || NBSP}</td>
              <td className="border px-2 py-1">{r.p || NBSP}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
