import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { FiArrowRight, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";


export default function UpdateMusterRoll() {

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [confirmAdjustmentDelete, setConfirmAdjustmentDelete] = useState(null);
  const AUTH_KEY = "stm_muster_auth_expiry";
  const AUTH_DURATION = 30 * 60 * 1000; // 20 mins
  const PASSWORD = "STM@2025"; // change this


  const [isAuthed, setIsAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const [leaveSummary, setLeaveSummary] = useState({
    LeaveDays: "",
    SickDays: "",
    MaternityDays: "",
    NightshiftAllowance: "",
    ProductDeductions: "",
    LeaveAllowance: "",
  });

const [adjustments, setAdjustments] = useState([]);
const addAdjustment = () => {
  setAdjustments((prev) => [...prev, { type: "", value: "", note: "" }]);
};

const removeAdjustment = (index) => {
  setAdjustments((prev) => prev.filter((_, i) => i !== index));
};

const handleAdjustmentChange = (index, field, value) => {
  setAdjustments((prev) => {
    const updated = [...prev];
    updated[index][field] = value;
    return updated;
  });
};
  // Helper: consistent YYYY-MM-DD
  const localDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Generate date range for previous month (27th → 26th)
  const generateDateRange = (month, year) => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const actualYear = month === 0 ? year - 1 : year;
    const startDate = new Date(actualYear, prevMonth, 26);
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
        setIsFetching(true);

        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const year = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

        const res = await fetch(
          `/api/employees/report?employeeId=${selectedEmployee}&month=${prevMonth}&year=${year}`
        );
        if (!res.ok) throw new Error("Failed to fetch employee muster roll");

        const data = await res.json();
        //console.log("Fetched existing muster roll:", data);

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

        const prefilled = generateDateRange(selectedMonth, selectedYear).map((date) => {
          const dateKey = localDateKey(date);
          return attendanceMap[dateKey] || { TimeIn: "", TimeOut: "" };
        });

        setAttendanceData(prefilled);

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

    //  Load any existing adjustments
    if (Array.isArray(data.adjustments) && data.adjustments.length > 0) {
      setAdjustments(
        data.adjustments.map((adj) => ({
          id: adj.AdjustmentID || null,               
          type: adj.AdjustmentType || "",
          value: adj.AdjustmentValue || "",
          note: adj.Note || "",
        }))
      );

      console.log("Loaded adjustments:", data.adjustments);

    } else {
      setAdjustments([]);
    }


        setIsFetching(false);
        toast.success("Loaded existing muster roll data");
      } catch (err) {
        console.error(err);
        setIsFetching(false);
        toast.error("Failed to load existing muster roll data");
        setAttendanceData([]);
      }
    }

    fetchEmployeeMusterRoll();
  }, [selectedEmployee, selectedMonth, selectedYear]);

  // ==============================
  // Other effects
  // ==============================
  useEffect(() => {
    setDateRange(generateDateRange(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setIsFetching(true);
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");

        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees.");
      } finally {
        setIsFetching(false);
      }
    }

    fetchEmployees();
  }, []);



  useEffect(() => {
  const expiry = localStorage.getItem(AUTH_KEY);

  if (expiry && Date.now() < Number(expiry)) {
    setIsAuthed(true);
  } else {
    localStorage.removeItem(AUTH_KEY);
    setShowAuthDialog(true);
  }
}, []);
  
const handleAuthSubmit = () => {
  if (passwordInput !== PASSWORD) {
    toast.error("Incorrect password");
    return;
  }

  const expiry = Date.now() + AUTH_DURATION;
  localStorage.setItem(AUTH_KEY, expiry.toString());

  setIsAuthed(true);
  setShowAuthDialog(false);
  setPasswordInput("");
  toast.success("Access granted (30 minutes)");
};





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
    Month: selectedMonth,
    Year: selectedYear,
    AttendanceRecords: preparedAttendance,
    LeaveDays: Number(leaveSummary.LeaveDays) || 0,
    SickDays: Number(leaveSummary.SickDays) || 0,
    MaternityDays: Number(leaveSummary.MaternityDays) || 0,
    NightshiftAllowance: Number(leaveSummary.NightshiftAllowance) || 0,
    ProductDeductions: Number(leaveSummary.ProductDeductions) || 0,
    LeaveAllowance: Number(leaveSummary.LeaveAllowance) || 0,
  };

  //  Include Adjustments (Hours or Amount)
  payload.Adjustments = adjustments
    .filter(adj => adj.type && adj.value && adj.note.trim() !== "")
    .map(adj => ({
      AdjustmentType: adj.type,
      AdjustmentValue: Number(adj.value),
      Note: adj.note.trim(),
    }));

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

const deleteAdjustment = (index, id) => {
  setConfirmAdjustmentDelete({ index, id });
};


const confirmDeleteAdjustment = async () => {
  if (!confirmAdjustmentDelete) return;

  const { index, id } = confirmAdjustmentDelete;

  try {
    // Delete from DB only if the row is an existing adjustment
    if (id) {
      const res = await fetch(`/api/attendance/delete-adjustment/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete adjustment");
      toast.success("Adjustment deleted");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete adjustment");
  }

  // Always remove the row locally
  setAdjustments((prev) => prev.filter((_, i) => i !== index));

  setConfirmAdjustmentDelete(null);
};




  // ==============================
  // Loading UI
  // ==============================
  if (isFetching) {
    return (
      <div className="flex flex-col mt-[-100px] items-center justify-center h-screen bg-white">
        <div className="flex space-x-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-[2px] h-5 bg-blue-500 rounded animate-[wave_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.5}s` }}
            ></div>
          ))}
        </div>

        <p className="mt-6 text-sm  text-gray-800">
          Loading Muster Roll Data
        </p>

        <style>{`
          @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); } 
            20% { transform: scaleY(1.0); }
          }
        `}</style>
      </div>
    );
  }




 if (!isAuthed) {
  return (
    <>
      <Toaster position="top-right" richColors />
        <AlertDialog open={showAuthDialog}>
        <AlertDialogContent className="max-w-md ml-5">
          <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100">
              <FiLock className="w-7 h-7 text-blue-700" />
            </div>

            <AlertDialogTitle className="text-xl font-semibold">
              Restricted Access
            </AlertDialogTitle>

            <AlertDialogDescription className=" text-gray-800">
              This section is protected.  
              Enter the password to continue.
              <br />
              <span className="text-xs text-gray-500">
                Access resets automatically after 30 minutes.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Password input */}
          <div className="mt-2">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter access password"
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
                         text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel
              onClick={() => window.history.back()}
              className="text-gray-600"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleAuthSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Unlock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}



  // ==============================
  // Render
  // ==============================
  return (
    <div className="bg-gray-50 max-h-screen flex flex-col">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div className="fixed lg:ml-[270px] mt-[70px] top-0 left-0 right-0 bg-white z-50 shadow-md py-4 px-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg 2xl:text-2xl font-semibold text-gray-800">
          Update Muster Roll{" "}
          <Link
            to="/muster-roll-reports"
            className="inline-flex group items-center gap-2 text-sm font-semibold text-blue-800 ml-4 hover:text-blue-500 underline"
          >
            Go to Reports
            <FiArrowRight className="w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-3" />
          </Link>
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* Employee Selector */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Employee:</label>
            <select
              className="border border-gray-300 px-3 w-[100px] xl:w-auto py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-Select an Employee-</option>
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
              className="border border-gray-300 px-3 w-[100px] xl:w-auto py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
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

          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Year:</label>
            <select
              className="border border-gray-300 px-3 w-[100px] xl:w-auto py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
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
            {isSaving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 mt-[150px] xl:mt-[120px] max-w-6xl mx-auto w-full gap-6 px-6">
        {/* Attendance Table */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-y-auto 
            lg:max-h-[calc(350px)]
            xl:max-h-[calc(440px)]
            2xl:max-h-[calc(550px)]">
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
                        onChange={(e) => handleTimeChange(index, "TimeIn", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Tab" && !e.shiftKey) {
                            e.preventDefault();
                            const nextInput = document.getElementById(`timeout-${index}`);
                            nextInput?.focus();
                          }
                        }}
                        id={`timein-${index}`}
                        className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
                      />

                    </td>
                    <td className="border-t px-3 py-2">
                      <input
                          type="time"
                          id={`timeout-${index}`}
                          value={attendanceData[index]?.TimeOut || ""}
                          onChange={(e) => handleTimeChange(index, "TimeOut", e.target.value)}
                          onKeyDown={(e) => {
                            // Shift+Tab → go back to same row’s Time In
                            if (e.key === "Tab" && e.shiftKey) {
                              e.preventDefault();
                              const prevInput = document.getElementById(`timein-${index}`);
                              prevInput?.focus();
                            }

                            // Tab → go to next row’s Time In
                            else if (e.key === "Tab" && !e.shiftKey) {
                              e.preventDefault();
                              const nextInput = document.getElementById(`timein-${index + 1}`);
                              nextInput?.focus();
                            }
                          }}
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
        <div className="w-full lg:w-80 ">
          <div className="bg-blue-100 rounded-xl shadow-lg border border-gray-200 p-3 sticky top-[110px]">
            <h2 className="text-l flex font-semibold text-blue-900 mb-2 items-center mx-auto justify-center">
              Summary
            </h2>

            {[
              { key: "LeaveDays", label: "Annual Leave (days)" },
              { key: "SickDays", label: "Sick Leave (days)" },
              { key: "MaternityDays", label: "Maternity Leave (days)" },
              { key: "NightshiftAllowance", label: "Night Allowance (Ksh)" },
              { key: "ProductDeductions", label: "Products (Ksh)" },
              { key: "LeaveAllowance", label: "Leave Allowance (Ksh)" },
            ].map(({ key, label }) => (
              <div key={key} className="mb-2 flex flex-row gap-2 ">
                <label className="block flex-4/7 text-sm font-medium mb-2">{label}</label>
                <input
                  type="number"
                  min="0"
                  value={leaveSummary[key]}
                  onChange={(e) => handleSummaryChange(key, e.target.value)}
                  className="border bg-white flex-3/7 border-gray-300 rounded-lg px-3 py-1 w-full focus:ring-2 
                    text-sm focus:ring-blue-400"
                />
              </div>
            ))}


            {/* Adjustments Section */}
          
            <h2 className="  font-semibold mt-5 text-blue-900 mb-2 text-center">
              Adjustments
            </h2>

            {adjustments.length === 0 && (
              <p className="text-gray-500 text-sm text-center mb-3">
                No adjustments added yet.
              </p>
            )}

            <div className="flex  flex-col gap-3 mb-4 ">


           {adjustments.map((adj, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 items-center bg-slate-50 rounded-lg p-3 border border-blue-200"
          >
            <div className="flex gap-2 w-full justify-between">
               <select
              value={adj.type}
              onChange={(e) => handleAdjustmentChange(index, "type", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Type</option>
              <option value="Hours">Hours</option>
              <option value="Amount">Amount</option>
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="+/- Value"
              value={adj.value}
              onChange={(e) => handleAdjustmentChange(index, "value", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-36 focus:ring-2 focus:ring-blue-400"
            />
            </div>
           

            <textarea
              placeholder="Reason / Note"
              value={adj.note}
              onChange={(e) => handleAdjustmentChange(index, "note", e.target.value)}
              className="w-full h-13 border bg-white border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
            />

            {/* Remove + Delete buttons */}
            <div className="flex gap-3 justify-between w-full mt-2">
              {/* REMOVE: local only */}
              <button
                onClick={() => removeAdjustment(index)}
                className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
              >
                Remove
              </button>

              {/* DELETE: only if row came from database */}
              {adj.id && (
              <button
                onClick={() => deleteAdjustment(index, adj.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Delete
              </button>
            )}

            </div>
          </div>
        ))}


                  
            </div>

            <button
              onClick={addAdjustment}
              className="w-full  bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg 
              text-sm shadow font-medium transition"
            >
              + New Adjustment
            </button>
          </div>
          </div>
          </div>

         <AlertDialog
        open={!!confirmAdjustmentDelete}
        onOpenChange={() => setConfirmAdjustmentDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Adjustment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this adjustment?  
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAdjustmentDelete(null)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDeleteAdjustment}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
