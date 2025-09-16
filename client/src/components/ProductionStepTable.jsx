import React from "react";
import useDyeingStore from "../store/zustand";

export default function ProductionStepTable({ rows }) {
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
    const hasValue = value !== "" && value !== NBSP && value != null;
    const valueText = (typeof value === "string" ? value : String(value ?? ""))
      .replace(/\u00A0/g, " ")
      .trim();

    const isStopped = valueText.toLowerCase().includes("stopped");

    const isWeeklyTotalCol = colKey === "total";
    const isBeamBTotal = row.isBeamB && isWeeklyTotalCol;
    const isDailyTotal = row.isDailyTotal && isWeeklyTotalCol;

    const bgClass =
      isStopped ||
      (isNotesRow && hasValue) ||
      isBeamBTotal ||
      isDailyTotal
        ? "bg-yellow-200"
        : "";

    return (
      <td className={`border border-gray-600 px-2 py-1 align-middle ${bgClass}`}>
        {formatNumber(value)}
      </td>
    );
  };

  return (
    <table className="table-auto border-collapse border border-gray-600 w-full text-[6px] sm:text-[10px] md:text-xs lg:text-[11px] text-center">
      <thead>
        <tr className="bg-gray-300">
          <th className="border border-gray-600 px-2 py-1 align-middle w-40"></th>
          {headers.map((h, i) => (
            <th
              key={i}
              className="border border-gray-600 px-2 py-1 align-middle w-40 font-semibold"
            >
              {h}
            </th>
          ))}
          <th className="border border-gray-600 px-2 py-1 align-middle w-28 font-semibold">
            Weekly Total
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) =>
          r.isTitle ? (
            <tr key={i} className="bg-blue-100 font-bold">
              <td
                className="border border-gray-600 px-2 py-1 text-left"
                colSpan={headers.length + 2}
              >
                {r.prodInfo}
              </td>
            </tr>
          ) : (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-600 px-2 py-1 align-middle">
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
          )
        )}
      </tbody>
    </table>
  );
}
