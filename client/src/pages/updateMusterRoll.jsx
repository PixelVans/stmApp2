import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export default function UpdateMusterRoll() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [attendanceData, setAttendanceData] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  const [leaveSummary, setLeaveSummary] = useState({
    LeaveDays: "",
    SickDays: "",
    MaternityDays: "",
    HolidayDays: "",
  });

  // Generate date range for selected month
  const generateDateRange = (month) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, month, 27);
    const endDate = new Date(year, month + 1, 26);
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };


  


  useEffect(() => {
    setDateRange(generateDateRange(selectedMonth));
  }, [selectedMonth]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");

        const data = await res.json();
        console.log(data)
        setEmployees(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees.");
      }
    }
    fetchEmployees();
  }, []);

  
  const handleTimeChange = (index, field, value) => {
    const updated = [...attendanceData];
    updated[index] = { ...updated[index], [field]: value };
    setAttendanceData(updated);
  };

  const handleSummaryChange = (field, value) => {
    setLeaveSummary((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const isSunday = (date) => date.getDay() === 0;

  // Normalize blank or invalid time values before sending
  const normalizeTime = (time) => {
    if (!time || time === "0000" || time === "00:00") return null;
    return time.length === 5 ? `${time}:00` : time;
  };

  const handleSave = async () => {
    if (!selectedEmployee) {
      toast.warning("Please select an employee first.");
      return;
    }

 const preparedAttendance = dateRange.map((date, index) => {
  const record = attendanceData[index] || {};
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" }); // 'Mon', 'Tue', etc.

      return {
        EmployeeID: selectedEmployee,
        AttendanceDate: date.toISOString().split("T")[0],
        TimeIn: normalizeTime(record.TimeIn),
        TimeOut: normalizeTime(record.TimeOut),
        DayOfWeek: dayOfWeek, 
      };
    });


    const payload = {
      EmployeeID: selectedEmployee,
      Month: selectedMonth,
      AttendanceRecords: preparedAttendance,
      LeaveDays: Number(leaveSummary.LeaveDays) || 0,
      SickDays: Number(leaveSummary.SickDays) || 0,
      MaternityDays: Number(leaveSummary.MaternityDays) || 0,
      HolidayDays: Number(leaveSummary.HolidayDays) || 0,
    };

    console.log("🟢 Sending attendance payload:", payload);

    try {
      const res = await fetch("/api/attendance/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save attendance");

      const result = await res.json();
      toast.success(`${result.message}`);
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error("Failed to save attendance. Please try again.");
    }
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="bg-gray-50 max-h-screen flex flex-col">
      <Toaster position="top-right" richColors />

      {/* Fixed Control Panel */}
      <div className="fixed ml-[270px] mt-[70px] top-0 left-0 right-0 bg-white z-50 shadow-md py-4 px-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Update Muster Roll
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* Employee Selector */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Employee:</label>
            <select
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.EmployeeID} value={emp.EmployeeID}>
                  {emp.FirstName} {emp.LastName}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Month:</label>
            <select
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!selectedEmployee}
            // disabled={true}
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* 🧾 Main Scroll Area */}
      <div className="flex flex-1 mt-[120px] max-w-6xl mx-auto w-full gap-6 px-6">
        {/* LEFT: Scrollable Attendance Table */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-y-auto max-h-[calc(550px)]">
          <table className="w-full text-sm">
            <thead className="bg-blue-100 text-gray-700 uppercase sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left w-20">Day</th>
                <th className="px-3 py-2 text-left w-28">Date</th>
                <th className="px-3 py-2 text-left">Time In</th>
                <th className="px-3 py-2 text-left">Time Out</th>
              </tr>
            </thead>
            <tbody>
              {dateRange.map((date, index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="border-t px-3 py-2 font-medium text-gray-800">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </td>
                    <td className="border-t px-3 py-2 text-gray-700">
                      {date.toISOString().split("T")[0]}
                    </td>
                    <td className="border-t px-3 py-2">
                      <input
                        type="time"
                        className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                        onChange={(e) =>
                          handleTimeChange(index, "TimeIn", e.target.value)
                        }
                      />
                    </td>
                    <td className="border-t px-3 py-2">
                      <input
                        type="time"
                        className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                        onChange={(e) =>
                          handleTimeChange(index, "TimeOut", e.target.value)
                        }
                      />
                    </td>
                  </tr>

                  {isSunday(date) && (
                    <tr>
                      <td colSpan="4" className="bg-gray-200 h-6"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Sticky Leave Summary Panel */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sticky top-[120px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Leave & Absence Summary
            </h2>
            {Object.keys(leaveSummary).map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  {field.replace("Days", " Days")}
                </label>
                <input
                  type="number"
                  min="0"
                  value={leaveSummary[field]}
                  onChange={(e) => handleSummaryChange(field, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
