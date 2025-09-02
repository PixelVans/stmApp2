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
          <th className="border px-2 py-1 text-left hidden">Needed Totals</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          
          

          return (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border px-2 py-1">{r.chemical || NBSP}</td>
              <td className="border px-2 py-1 text-right">{r.kgs_needed || NBSP}</td>
              <td className="border px-2 py-1">{r.amt_on_hand || NBSP}</td>
              <td className="border px-2 py-1">{r.summary || NBSP}</td>
              <td className="border px-2 py-1">{r.cost_per_kg || NBSP}</td>
              <td className="border px-2 py-1">{r.total_cost || NBSP}</td>
              <td className="border px-2 py-1 hidden">{r.needed_totals || NBSP}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
