import React from "react";

export default function ChemicalSummaryTable({ rows }) {
  const NBSP = "\u00A0";

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-center">
      <thead>
        <tr className="bg-gray-200 text-center">
          <th className="border px-2 py-1">Chemicals Summary</th>
          <th className="border px-2 py-1">Kgs Needed</th>
          <th className="border px-2 py-1">Amt on Hand</th>
          <th className="border px-2 py-1">Summary</th>
          <th className="border px-2 py-1">Kg/Lt Cost</th>
          <th className="border px-2 py-1">Total Cost</th>
          <th className="border px-2 py-1 hidden">Needed Totals</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={i}
            className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} text-center`}
          >
            <td className="border px-2 py-1">{r.chemical || NBSP}</td>
            <td className="border px-2 py-1">{r.kgs_needed || NBSP}</td>
            <td className="border px-2 py-1">{r.amt_on_hand || NBSP}</td>
            <td className="border px-2 py-1">{r.summary || NBSP}</td>
            <td className="border px-2 py-1">{r.cost_per_kg || NBSP}</td>
            <td className="border px-2 py-1">{r.total_cost || NBSP}</td>
            <td className="border px-2 py-1 hidden">{r.needed_totals || NBSP}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
