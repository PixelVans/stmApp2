import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export default function UpdateMusterRoll() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [attendanceData, setAttendanceData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

 const [leaveSummary, setLeaveSummary] = useState({
  LeaveDays: "",
  SickDays: "",
  MaternityDays: "",
  NightshiftAllowance: "",
  ProductDeductions: "",
  LeaveAllowance: "",
});


  // Helper: consistent YYYY-MM-DD
  const localDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  //  Generate date range for *previous* month (27th → 26th)
  const generateDateRange = (month) => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const year = new Date().getFullYear() - (month === 0 ? 1 : 0);
    const startDate = new Date(year, prevMonth, 26);
    const endDate = new Date(year, month, 25);

    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  // ==============================
  // Fetch employee muster roll
  // ==============================
  useEffect(() => {
    if (!selectedEmployee) return;

    async function fetchEmployeeMusterRoll() {
      try {
        //  Shift fetch one month back
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const year = new Date().getFullYear() - (selectedMonth === 0 ? 1 : 0);

        const res = await fetch(
          `/api/employees/report?employeeId=${selectedEmployee}&month=${prevMonth}&year=${year}`
        );
        if (!res.ok) throw new Error("Failed to fetch employee muster roll");

        const data = await res.json();
        console.log("Fetched existing muster roll:", data);

        const attendanceMap = {};
        data.attendance?.forEach((rec) => {
          let recDate;
          if (/^\d{4}-\d{2}-\d{2}$/.test(rec.AttendanceDate)) {
            const [yy, mm, dd] = rec.AttendanceDate.split("-").map(Number);
            recDate = new Date(yy, mm - 1, dd);
          } else {
            const tmp = new Date(rec.AttendanceDate);
            recDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
          }

          const key = localDateKey(recDate);
          const formatTime = (timeStr) => {
            if (!timeStr) return "";
            const d = new Date(timeStr);
            const hh = d.getUTCHours().toString().padStart(2, "0");
            const mm = d.getUTCMinutes().toString().padStart(2, "0");
            return `${hh}:${mm}`;
          };

          attendanceMap[key] = {
            TimeIn: formatTime(rec.TimeIn),
            TimeOut: formatTime(rec.TimeOut),
            DayOfWeek: rec.DayOfWeek,
          };
        });

        //  Align with shifted date range
        const prefilled = generateDateRange(selectedMonth).map((date) => {
          const dateKey = localDateKey(date);
          return attendanceMap[dateKey] || { TimeIn: "", TimeOut: "" };
        });

        setAttendanceData(prefilled);

        // Leave summary
        if (data.summary) {
          setLeaveSummary({
            LeaveDays: data.summary.LeaveDays || "",
            SickDays: data.summary.SickDays || "",
            MaternityDays: data.summary.MaternityDays || "",
            NightshiftAllowance: data.summary.NightshiftAllowance || "",
            ProductDeductions: data.summary.ProductDeductions || "",
            LeaveAllowance: data.summary.LeaveAllowance || "",
          });
        } else {
          setLeaveSummary({
            LeaveDays: "",
            SickDays: "",
            MaternityDays: "",
            NightshiftAllowance: "",
            ProductDeductions: "",
            LeaveAllowance: "",
            
          });
        }

        toast.success("Loaded existing muster roll data");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load existing muster roll data");
        setAttendanceData([]);
      }
    }

    fetchEmployeeMusterRoll();
  }, [selectedEmployee, selectedMonth]);

  // ==============================
  // Other effects
  // ==============================
  useEffect(() => {
    setDateRange(generateDateRange(selectedMonth));
  }, [selectedMonth]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");

        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees.");
      }
    }
    fetchEmployees();
  }, []);

  // ==============================
  // Handlers
  // ==============================
  const handleTimeChange = (index, field, value) => {
    const updated = [...attendanceData];
    updated[index] = { ...updated[index], [field]: value };
    setAttendanceData(updated);
  };

  const handleSummaryChange = (field, value) => {
    setLeaveSummary((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const isSunday = (date) => date.getDay() === 0;

  const normalizeTime = (time) => {
    if (!time || time === "0000" || time === "00:00") return null;
    return time.length === 5 ? `${time}:00` : time;
  };

  // ==============================
  // Save handler
  // ==============================
  const handleSave = async () => {
    if (!selectedEmployee) {
      toast.warning("Please select an employee first.");
      return;
    }

    setIsSaving(true);

    const preparedAttendance = dateRange.map((date, index) => {
      const record = attendanceData[index] || {};
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
      return {
        EmployeeID: selectedEmployee,
        AttendanceDate: localDateKey(date),
        TimeIn: normalizeTime(record.TimeIn),
        TimeOut: normalizeTime(record.TimeOut),
        DayOfWeek: dayOfWeek,
      };
    });

    const payload = {
      EmployeeID: selectedEmployee,
      Month: selectedMonth, // UI month
      AttendanceRecords: preparedAttendance,
      LeaveDays: Number(leaveSummary.LeaveDays) || 0,
      SickDays: Number(leaveSummary.SickDays) || 0,
      MaternityDays: Number(leaveSummary.MaternityDays) || 0,
      NightshiftAllowance: Number(leaveSummary.NightshiftAllowance) || 0,
      ProductDeductions: Number(leaveSummary.ProductDeductions) || 0,
      LeaveAllowance: Number(leaveSummary.LeaveAllowance) || 0,
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
    } finally {
      setIsSaving(false);
    }
  };

  
  return (
    <div className="bg-gray-50 max-h-screen flex flex-col">
      <Toaster position="top-right" richColors />

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
            disabled={!selectedEmployee || isSaving}
            className={`${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium px-6 py-2 rounded-lg shadow transition disabled:bg-gray-400`}
          >
            {isSaving ? "Saving Attendance..." : "Save Attendance"}
          </button>
        </div>
      </div>

      {/* Main Table + Sidebar */}
      <div className="flex flex-1 mt-[120px] max-w-6xl mx-auto w-full gap-6 px-6">
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
                      {localDateKey(date)}
                    </td>
                    <td className="border-t px-3 py-2">
                      <input
                        type="time"
                        value={attendanceData[index]?.TimeIn || ""}
                        onChange={(e) =>
                          handleTimeChange(index, "TimeIn", e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                    <td className="border-t px-3 py-2">
                      <input
                        type="time"
                        value={attendanceData[index]?.TimeOut || ""}
                        onChange={(e) =>
                          handleTimeChange(index, "TimeOut", e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
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

        {/* RIGHT: Sticky Leave Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sticky top-[120px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Leave & Absence Summary
            </h2>

            {/* Leave & Allowance fields */}
              {[
                { key: "LeaveDays", label: "Annual Leave" },
                { key: "SickDays", label: "Sick Leave" },
                { key: "MaternityDays", label: "Maternity Leave" },
                { key: "NightshiftAllowance", label: "Night Allowance (₦)" },
                { key: "ProductDeductions", label: "Products (₦)" },
                { key: "LeaveAllowance", label: "Leave Allowance (₦)" },
              ].map(({ key, label }) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">{label}</label>
                  <input
                    type="number"
                    min="0"
                    value={leaveSummary[key]}
                    onChange={(e) => handleSummaryChange(key, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full focus:ring-2 text-sm focus:ring-blue-400"
                  />
                </div>
              ))}

          </div>
        </div>
      </div>
    </div>
  );

}
