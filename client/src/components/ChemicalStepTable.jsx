import React from "react";

export default function ChemicalStepTable({ rows }) {
  const NBSP = "\u00A0";

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1 text-left">Chemical</th>
          <th className="border px-2 py-1 text-right">Grams/Lt</th>
          <th className="border px-2 py-1 text-left">Amount</th>
          <th className="border px-2 py-1 text-left">Temp</th>
          <th className="border px-2 py-1 text-left">Time</th>
          <th className="border px-2 py-1 text-left">pH</th>
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
                  <div className="bg-yellow-200 h-10 w-full flex items-center justify-center font-semibold">
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
