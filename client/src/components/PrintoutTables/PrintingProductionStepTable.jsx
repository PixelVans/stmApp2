import React from "react";
import useDyeingStore from "../../store/zustand";

export default function PrintingProductionStepTable({ rows }) {
  const NBSP = "\u00A0";
  const { selectedWeek } = useDyeingStore();

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  function getMondayOfISOWeek(week, year) {
    const simple = new Date(year, 0, 4);
    const dayOfWeek = simple.getDay() || 7;
    const monday = new Date(simple);
    monday.setDate(simple.getDate() - dayOfWeek + 1 + (week - 1) * 7);
    return monday;
  }

  const year = new Date().getFullYear();
  const monday = getMondayOfISOWeek(selectedWeek, year);

  // headers
  const headers = days.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${label} ${months[d.getMonth()]} ${getOrdinal(d.getDate())}`;
  });

  const formatNumber = (value) => {
    if (value === NBSP || value === "" || value == null) return NBSP;
    if (typeof value === "number") {
      return value.toLocaleString("en-US"); 
    }
    return value;
  };

  const renderCell = (value, row, colKey) => {
    const isNotesRow = row.prodInfo?.toLowerCase().includes("notes");
    const isShiftRow = row.prodInfo?.toLowerCase().includes("shift");
    const isTotalRow = row.prodInfo?.toLowerCase().includes("total");
    const hasValue = value !== "" && value !== NBSP && value != null;

    const isWeeklyTotalCol = colKey === "total";
    const isBeamBTotal = row.isBeamB && isWeeklyTotalCol;
    const isDailyTotal = row.prodInfo?.toLowerCase().includes("daily total") && isWeeklyTotalCol;

    return (
      <td
        className={`border border-gray-500 px-2 align-middle 
          ${isNotesRow && hasValue ? "bg-yellow-300 font-semibold" : ""}
          ${(isShiftRow || isTotalRow) && hasValue ? "font-bold" : ""}
          ${(isBeamBTotal || isDailyTotal) ? "bg-yellow-300 font-semibold" : ""}
        `}
      >
        {formatNumber(value)}
      </td>
    );
  };

  return (
    <table className="table-auto border-collapse border border-gray-500 w-full text-[10px] text-center">
      <thead>
        <tr className="bg-gray-300">
          <th className="border border-gray-500 px-2 align-middle w-40"></th>
          {headers.map((h, i) => (
            <th
              key={i}
              className="border border-gray-500 text-[11px] align-middle w-40 font-bold"
            >
              {h}
            </th>
          ))}
          <th className="border border-gray-500 px-2 align-middle w-28 font-bold">
            Weekly Total
          </th>
        </tr>
      </thead>
      <tbody>
  {(() => {
    
    const dailyIndex = rows.findIndex((r) => r.prodInfo === "Daily Total");

    return rows.map((r, i) => {
      // title rows unchanged
      if (r.isTitle) {
        return (
          <tr key={`title-${i}`} className="bg-blue-200 font-bold">
            <td
              className="border border-gray-500 px-2 text-left"
              colSpan={headers.length + 2}
            >
              {r.prodInfo}
            </td>
          </tr>
        );
      }
    if (i === dailyIndex) {
        return (
          <React.Fragment key={`daily-frag-${i}`}>
            {/* space above Daily Total row*/}
            <tr key={`spacer-${i}`}>
              <td colSpan={headers.length + 2} className="h-3"></td>
            </tr>

            {/* Daily Total row */}
            <tr key={`row-${i}`} className=" font-bold ">
              <td className="border border-gray-500 px-2 align-middle">
                {r.prodInfo || NBSP}
              </td>
              {renderCell(r.mon, r, "mon")}
              {renderCell(r.tue, r, "tue")}
              {renderCell(r.wed, r, "wed")}
              {renderCell(r.thur, r, "thur")}
              {renderCell(r.fri, r, "fri")}
              {renderCell(r.sat, r, "sat")}
              {renderCell(r.sun, r, "sun")}
              {renderCell(r.total, r, "total")}
            </tr>
          </React.Fragment>
        );
      }

      return (
        <tr key={`row-${i}`}>
          <td className="border border-gray-500 px-2 align-middle">
            {r.prodInfo || NBSP}
          </td>
          {renderCell(r.mon, r, "mon")}
          {renderCell(r.tue, r, "tue")}
          {renderCell(r.wed, r, "wed")}
          {renderCell(r.thur, r, "thur")}
          {renderCell(r.fri, r, "fri")}
          {renderCell(r.sat, r, "sat")}
          {renderCell(r.sun, r, "sun")}
          {renderCell(r.total, r, "total")}
        </tr>
      );
    });
  })()}
</tbody>

    </table>
  );
}
