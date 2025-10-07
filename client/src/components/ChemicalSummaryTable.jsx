import React from "react";

export default function ChemicalSummaryTable({ rows, stepTitle }) {
  const NBSP = "\u00A0";

  return (
    <>
      {stepTitle && (
        <tr className="bg-blue-50 font-semibold text-gray-700">
          <td
            className="border border-gray-600 px-2 py-1 text-left"
            colSpan={6}
          >
            {stepTitle}
          </td>
        </tr>
      )}

      {rows.map((r, i) => {
        const isShortfall =
          (r.summary || "").toString().toLowerCase().includes("shortfall");

        return (
          <tr
            key={i}
            className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} text-center`}
          >
            <td className="border border-gray-600 px-2 py-1">
              {r.chemical || NBSP}
            </td>
            <td className="border border-gray-600 px-2 py-1">
              {r.kgs_needed || NBSP}
            </td>
            <td
              className={`border border-gray-600 px-2 py-1 ${
                isShortfall ? "bg-yellow-200 font-semibold" : ""
              }`}
            >
              {r.amt_on_hand || NBSP}
            </td>
            <td
              className={`border border-gray-600 px-2 py-1 ${
                isShortfall ? "bg-yellow-200 font-semibold" : ""
              }`}
            >
              {r.summary || NBSP}
            </td>
            <td className="border border-gray-600 px-2 py-1">
              {r.cost_per_kg || NBSP}
            </td>
            <td className="border border-gray-600 px-2 py-1">
              {r.total_cost || NBSP}
            </td>
            <td className="border border-gray-600 px-2 py-1 hidden">
              {r.needed_totals || NBSP}
            </td>
          </tr>
        );
      })}
    </>
  );
}
