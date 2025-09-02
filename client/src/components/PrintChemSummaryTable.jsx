import React from "react";

export default function PrintChemSummaryTable({ rows }) {
  const NBSP = "\u00A0";

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-[10px]">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-0.5 py-0.5 text-center">Chemicals Summary</th>
          <th className="border px-0.5 py-0.5 text-center">Kgs Needed</th>
          <th className="border px-0.5 py-0.5 text-center">Amt on Hand</th>
          <th className="border px-0.5 py-0.5 text-center">Summary</th>
          <th className="border px-0.5 py-0.5 text-center">Kg/Lt Cost</th>
          <th className="border px-0.5 py-0.5 text-center">Total Cost</th>
          <th className="border px-0.5 py-0.5 text-center hidden">Needed Totals</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="border px-0.5 py-0.5 text-center">{r.chemical || NBSP}</td>
            <td className="border px-0.5 py-0.5 text-center">{r.kgs_needed || NBSP}</td>
            <td className="border px-0.5 py-0.5 text-center">{r.amt_on_hand || NBSP}</td>
            <td className="border px-0.5 py-0.5 text-center">{r.summary || NBSP}</td>
            <td className="border px-0.5 py-0.5 text-center">{r.cost_per_kg || NBSP}</td>
            <td className="border px-0.5 py-0.5 text-center">{r.total_cost || NBSP}</td>
            <td className="border px-0.5 py-0.5 text-center hidden">{r.needed_totals || NBSP}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
