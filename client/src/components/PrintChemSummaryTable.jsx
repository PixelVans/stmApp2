import React from "react";

export default function PrintChemSummaryTable({ steps }) {
  const NBSP = "\u00A0";

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-center">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-0.5 py-0.5 text-center">Chemicals Summary</th>
          <th className="border px-0.5 py-0.5 text-center w-24">Kgs Needed</th>
          <th className="border px-0.5 py-0.5 text-center w-24">Amt on Hand</th>
          <th className="border px-0.5 py-0.5 text-center w-24">Summary</th>
          <th className="border px-0.5 py-0.5 text-center w-24">Kg/Lt Cost</th>
          <th className="border px-0.5 py-0.5 text-center w-24">Total Cost</th>
          <th className="border px-0.5 py-0.5 text-center hidden">Needed Totals</th>
        </tr>
      </thead>
      <tbody>
        {steps.map((step, sIdx) => (
          <React.Fragment key={sIdx}>
            {/* 🔹 Section row */}
            <tr className="bg-blue-50 font-bold">
              <td
                colSpan={7}
                className="border px-0.5 py-0.5 text-left text-gray-700"
              >
                {step.step}
              </td>
            </tr>

            {/* 🔹 Rows for chemicals */}
            {step.rows.map((r, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? "bg-white" : "bg-white"} text-center`}
              >
                <td className="border px-0.5 py-0.5">{r.chemical || NBSP}</td>
                <td className="border px-0.5 py-0.5">{r.kgs_needed || NBSP}</td>
                <td className="border px-0.5 py-0.5">{r.amt_on_hand || NBSP}</td>
                <td className="border px-0.5 py-0.5">{r.summary || NBSP}</td>
                <td className="border px-0.5 py-0.5">{r.cost_per_kg || NBSP}</td>
                <td className="border px-0.5 py-0.5">{r.total_cost || NBSP}</td>
                <td className="border px-0.5 py-0.5 hidden">{r.needed_totals || NBSP}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
