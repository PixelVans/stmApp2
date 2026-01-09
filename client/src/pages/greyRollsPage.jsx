"use client";

import { useState, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const dummyData = [
  { RollNo: 101, Date: "2026-01-09", MachineNo: "1", Article: "Plain CounterPane", Length: 45.25, Weight: 12.5, Weaver: "John Doe", Shift: "A", Grade: "A", Remarks: "Good quality" },
  { RollNo: 102, Date: "2026-01-09", MachineNo: "2", Article: "Towel", Length: 30.5, Weight: 8.2, Weaver: "Jane Smith", Shift: "B", Grade: "B", Remarks: "Minor defects" },
  { RollNo: 103, Date: "2026-01-09", MachineNo: "1", Article: "Bed Sheet", Length: 50.0, Weight: 15.0, Weaver: "Alice Brown", Shift: "A", Grade: "A", Remarks: "" },
  { RollNo: 104, Date: "2026-01-09", MachineNo: "3", Article: "Cellular", Length: 40.0, Weight: 10.0, Weaver: "Bob Green", Shift: "B", Grade: "C", Remarks: "Check color" },
  { RollNo: 105, Date: "2026-01-09", MachineNo: "2", Article: "CreamStripe Blue", Length: 35.5, Weight: 9.5, Weaver: "Carol White", Shift: "A", Grade: "B", Remarks: "" },
];

const GreyRollsTable = () => {
  const [data] = useState(dummyData);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filters, setFilters] = useState({ MachineNo: "", Shift: "", Grade: "", Article: "", Weaver: "" });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        sortableData = sortableData.filter((item) => item[key] === value);
      }
    });
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue;
        }
        return sortConfig.direction === "ascending"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return sortableData;
  }, [data, sortConfig, filters]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline ml-1 text-gray-400" />;
    if (sortConfig.direction === "ascending") return <FaSortUp className="inline ml-1 text-blue-600" />;
    return <FaSortDown className="inline ml-1 text-blue-600" />;
  };

  const getUniqueValues = (field) => [...new Set(dummyData.map((d) => d[field]))];

  return (
    <div className="p-6 max-w-full overflow-x-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-700">Grey Rolls Records</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-start items-center">
        {["MachineNo", "Shift", "Grade", "Article", "Weaver"].map((field) => (
          <select
            key={field}
            value={filters[field]}
            onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">All {field}</option>
            {getUniqueValues(field).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        ))}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          onClick={() => setFilters({ MachineNo: "", Shift: "", Grade: "", Article: "", Weaver: "" })}
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-blue-100 sticky top-0 z-10">
          <tr>
            {[
              { key: "RollNo", label: "Roll No" },
              { key: "Date", label: "Date" },
              { key: "MachineNo", label: "Machine" },
              { key: "Article", label: "Article" },
              { key: "Length", label: "Length (m)" },
              { key: "Weight", label: "Weight (kg)" },
              { key: "Weaver", label: "Weaver" },
              { key: "Shift", label: "Shift" },
              { key: "Grade", label: "Grade" },
              { key: "Remarks", label: "Remarks" },
            ].map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer select-none hover:bg-blue-200 transition"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {renderSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, idx) => (
              <tr
                key={row.RollNo}
                className={`transition hover:bg-blue-50 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="px-4 py-2 border-b border-gray-200">{row.RollNo}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Date}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.MachineNo}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Article}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Length}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Weight}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Weaver}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Shift}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Grade}</td>
                <td className="px-4 py-2 border-b border-gray-200">{row.Remarks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GreyRollsTable;
