import React from "react";

export default function ChemicalSummaryTable({ rows, stepTitle }) {
  const NBSP = "\u00A0";

  return (
    <>
      {stepTitle && (
        <tr className="bg-blue-50 font-semibold text-gray-700">
          <td
            className="border px-2 py-1 text-left"
            colSpan={6} // covers all visible columns
          >
            {stepTitle}
          </td>
        </tr>
      )}

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
    </>
  );
}
