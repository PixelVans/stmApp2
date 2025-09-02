import React from "react";

export default function PrintChemStepTable({ rows }) {
  const NBSP = "\u00A0";

  const isInstructionRow = (r) => {
    const chemText = (r.chemical || "").toString().toUpperCase().trim();
    return (
      !!r.isInstructionRow ||
      chemText.includes("REMAIN IN DWELL") ||
      chemText.includes("WAIT FOR") ||
      chemText === "E" ||
      chemText.includes("20 MIN")
    );
  };

  const groupRows = (rows) => {
    const groups = [];
    let current = [];

    for (const r of rows) {
      if (isInstructionRow(r)) {
        if (current.length > 0) {
          groups.push({ type: "group", rows: current });
          current = [];
        }
        groups.push({ type: "instruction", row: r });
        continue;
      }

      const phSafe = r.ph === undefined || r.ph === null ? "" : String(r.ph).toLowerCase();

      if (phSafe === "drain") {
        if (current.length > 0) {
          groups.push({ type: "group", rows: current });
          current = [];
        }
        groups.push({ type: "drain", row: r });
      } else {
        current.push(r);
      }
    }

    if (current.length > 0) {
      groups.push({ type: "group", rows: current });
    }

    return groups;
  };

  const grouped = groupRows(rows || []);
  let globalRowIndex = 0;

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full text-[10px] text-center">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-0.5 py-0.5 align-middle">Chemical</th>
          <th className="border px-0.5 py-0.5 align-middle">Grams/Lt</th>
          <th className="border px-0.5 py-0.5 align-middle">Amount</th>
          <th className="border px-0.5 py-0.5 align-middle">Temp</th>
          <th className="border px-0.5 py-0.5 align-middle">Time</th>
          <th className="border px-0.5 py-0.5 align-middle">pH</th>
        </tr>
      </thead>

      <tbody>
        {grouped.map((g, gIdx) => {
          if (g.type === "instruction") {
            return (
              <tr key={`instr-${gIdx}`}>
                <td colSpan={6} className="border p-0">
                  <div className="bg-yellow-200 h-6 w-full flex items-center justify-center font-semibold text-[10px] leading-tight">
                    {g.row.chemical || NBSP}
                  </div>
                </td>
              </tr>
            );
          }

          if (g.type === "drain") {
            const r = g.row;
            const bg = globalRowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";
            globalRowIndex += 1;
            return (
              <tr key={`drain-${gIdx}`} className={`${bg} font-semibold`}>
                <td className="border px-0.5 py-0.5 align-middle">{r.chemical || NBSP}</td>
                <td className="border px-0.5 py-0.5 align-middle">{r.gramsPerLt || NBSP}</td>
                <td className="border px-0.5 py-0.5 align-middle">{r.amount || NBSP}</td>
                <td className="border px-0.5 py-0.5 align-middle">{r.temp || NBSP}</td>
                <td className="border px-0.5 py-0.5 align-middle">{r.time || NBSP}</td>
                <td className="border px-0.5 py-0.5 align-middle font-bold italic">
                  {r.ph || NBSP}
                </td>
              </tr>
            );
          }

          const groupRowsArr = g.rows;
          const pickFirstNonEmpty = (key) => {
            for (const rr of groupRowsArr) {
              if (rr[key] !== undefined && rr[key] !== null && String(rr[key]).trim() !== "") {
                return rr[key];
              }
            }
            return NBSP;
          };
          const groupTemp = pickFirstNonEmpty("temp");
          const groupTime = pickFirstNonEmpty("time");
          const groupPh = pickFirstNonEmpty("ph");

          return groupRowsArr.map((r, i) => {
            const isFirst = i === 0;
            const bg = globalRowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";
            globalRowIndex += 1;

            return (
              <tr key={`g-${gIdx}-r-${i}`} className={bg}>
                <td className="border px-0.5 py-0.5 align-middle">{r.chemical || NBSP}</td>
                <td className="border px-0.5 py-0.5 align-middle">{r.gramsPerLt || NBSP}</td>
                <td className="border px-0.5 py-0.5 align-middle">{r.amount || NBSP}</td>

                {isFirst && (
                  <>
                    <td className="border px-0.5 py-0.5 align-middle" rowSpan={groupRowsArr.length}>
                      {groupTemp}
                    </td>
                    <td className="border px-0.5 py-0.5 align-middle" rowSpan={groupRowsArr.length}>
                      {groupTime}
                    </td>
                    <td className="border px-0.5 py-0.5 align-middle" rowSpan={groupRowsArr.length}>
                      {groupPh}
                    </td>
                  </>
                )}
              </tr>
            );
          });
        })}
      </tbody>
    </table>
  );
}
