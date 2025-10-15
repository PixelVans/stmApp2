import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

let lastToastKey = null; // prevent double toast during React Strict Mode re-renders

const PrintingMusterRollReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    LeaveDays: 0,
    SickDays: 0,
    MaternityDays: 0,
    HolidayDays: 0,
  });

  // Generate range from 27th of current month to 26th of next
  const generateDateRange = (month) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, month, 26);
    const endDate = new Date(year, month + 1, 25);
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const [dateRange, setDateRange] = useState(generateDateRange(selectedMonth));
  useEffect(() => {
    setDateRange(generateDateRange(selectedMonth));
  }, [selectedMonth]);

  // Fetch employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        console.log("Fetched employees:", data);
        setEmployees(data);
      } catch {
        toast.error("Error fetching employees");
      }
    }
    fetchEmployees();
  }, []);

  // Fetch report when employee or month changes
  useEffect(() => {
    if (!selectedEmployee) return;

    async function fetchReport() {
      try {
        const res = await fetch(
          `/api/employees/report?employeeId=${selectedEmployee}&month=${selectedMonth}`
        );
        if (!res.ok) throw new Error("Failed to fetch muster roll report");
        const data = await res.json();

        setAttendanceData(data.attendance || []);
        setSummary(data.summary || {});

        const toastKey = `${selectedEmployee}-${selectedMonth}`;
        if (lastToastKey !== toastKey) {
          toast.success("Report loaded");
          lastToastKey = toastKey;
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading report");
      }
    }

    fetchReport();
  }, [selectedEmployee, selectedMonth]);

  // ---------------- CALCULATIONS ----------------
  const totalPresent = attendanceData.filter((r) => r.TimeIn).length;
  const totalAbsent = attendanceData.filter((r) => !r.TimeIn).length;

  // Group attendance data by ISO week (Monday–Saturday)
  const groupByWeek = (records) => {
    const weeks = {};
    records.forEach((r) => {
      if (!r.AttendanceDate) return;
      const date = new Date(r.AttendanceDate);
      const yearStart = new Date(date.getFullYear(), 0, 1);
      const weekNo = Math.floor(
        ((date - yearStart) / 86400000 + yearStart.getDay() + 1) / 7
      );
      const key = `${date.getFullYear()}-W${weekNo}`;
      if (!weeks[key]) weeks[key] = [];
      weeks[key].push(r);
    });
    return weeks;
  };

  const weeks = groupByWeek(attendanceData);
  let totalRegularHours = 0;
  let totalOvertimeHours = 0;

  Object.values(weeks).forEach((records) => {
    const weeklyHours = records
      .filter(
        (r) =>
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(r.DayOfWeek) &&
          r.TotalHours
      )
      .reduce((sum, r) => sum + r.TotalHours, 0);

    if (weeklyHours > 45) {
      totalRegularHours += 45;
      totalOvertimeHours += weeklyHours - 45;
    } else {
      totalRegularHours += weeklyHours;
    }
  });

  const overtimePayable = totalOvertimeHours * 1.5;
  const sundayHours = attendanceData
    .filter((r) => r.DayOfWeek === "Sun" && r.TotalHours)
    .reduce((sum, r) => sum + r.TotalHours, 0);
  const sundayPayable = sundayHours * 2;
  const totalHours = attendanceData
    .filter((r) => r.TotalHours)
    .reduce((sum, r) => sum + r.TotalHours, 0);

  // ---------------- DYNAMIC HEADER VALUES ----------------
  const selectedEmp = employees.find(
    (emp) => emp.EmployeeID === Number(selectedEmployee)
  );
  const employeeName = selectedEmp
    ? `${selectedEmp.FirstName} ${selectedEmp.LastName}`
    : "—";
  const employeeId = selectedEmp ? selectedEmp.EmployeeID : "—";
  const monthLabel = new Date(
    new Date().getFullYear(),
    selectedMonth
  ).toLocaleString("en-US", { month: "long", year: "numeric" });

  // ---------------- UI ----------------
  return (
    <div className="bg-white min-h-screen p-8 text-gray-800">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 ">
        <h1 className="text-2xl font-bold">Muster Roll Report (Printable)</h1>

        <div className="flex gap-4 items-center">
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(Number(e.target.value))}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.EmployeeID} value={emp.EmployeeID}>
                {emp.FirstName} {emp.LastName}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 px-3 py-2 rounded-lg"
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
      </div>

      {/* Dynamic Form Header Section */}
      <div className="max-w-3xl mx-auto  ">
        <h1 className="text-center font-bold">SPECIALISED TOWEL MANUFACTURERS LTD.</h1>
        <h4 className="text-center font-semibold text-xs mb-4" >MUSTEROLL FORM.</h4>

      <div className="text-center mb-6 ">
        <div className="flex justify-center items-center gap-20">
          <div className="border-1 border-slate-500  px-4 ">
            <label className="font-semibold mr-2">Name:</label>
            <span>{employeeName}</span>
          </div>
          <div className="border-1 border-slate-500  px-4 ">
            <label className="font-semibold mr-2">Form No:</label>
            <span>{employeeId}</span>
          </div>
        </div>
        <div className="border-1 border-slate-500  px-4  mx-auto mt-4 w-64">
          <label className="font-semibold mr-2">Month:</label>
          <span>{monthLabel}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className=" rounded-lg ">
        <div className="grid grid-cols-3 gap-2 items-start">
          {/* Attendance Table */}
          <div className="col-span-2  overflow-hidden ">
            <table className="w-full text-xs border border-gray-300">
              <thead className="bg-blue-100 text-gray-800 uppercase">
                <tr>
                  <th className="border border-gray-500 py-1  text-center w-10">
                    Day
                  </th>
                  <th className="border border-gray-500  py-1 text-center w-10">
                    Date
                  </th>
                  <th className="border border-gray-500 py-1  text-center w-10">
                    Time In
                  </th>
                  <th className="border border-gray-500 py-1  text-center w-10">
                    Time Out
                  </th>
                  <th className="border border-gray-500  py-1 text-center w-10">
                    Total Hrs
                  </th>
                </tr>
              </thead>
              <tbody>
                {dateRange.map((date, index) => {
                  const rec = attendanceData.find(
                    (r) =>
                      new Date(r.AttendanceDate).toISOString().split("T")[0] ===
                      date.toISOString().split("T")[0]
                  );

                  const dayName =
                    rec?.DayOfWeek ||
                    date.toLocaleDateString("en-US", { weekday: "short" });

                  return (
                    <React.Fragment key={index}>
                      <tr className="bg-white hover:bg-blue-50">
                        <td className="border border-gray-500 px-1 text-xs font-medium">
                          {dayName}
                        </td>
                        <td className="border border-gray-500 text-[11px] py-0.5 text-center">
                          {`${date.getDate()}/${date.getMonth() + 1}`}
                        </td>
                        <td className="border border-gray-500 text-[11px] text-center">
                          {rec?.TimeIn
                            ? new Date(rec.TimeIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </td>
                        <td className="border border-gray-500 text-[11px] text-center">
                          {rec?.TimeOut
                            ? new Date(rec.TimeOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </td>
                        <td className="border border-gray-500 text-[11px] text-center">
                          {rec?.TotalHours != null ? rec.TotalHours.toFixed(2) : ""}
                        </td>
                      </tr>

                      {/* Add small separator after Sunday */}
                      {dayName === "Sun" && (
                        <tr>
                          <td colSpan="5">
                            <div className="h-3 bg-gray-200" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}


                <tr className="bg-blue-50 font-semibold">
                  <td colSpan="4" className="border border-gray-500 px-3 text-[11px] py-0.5">
                    Monthly Total Hours
                  </td>
                  <td className="border border-gray-500 px-3 py-1 text-right">
                    {totalHours.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <h1 className="text-center font-semibold mb-5 mt-10">Employee Signature
              .........................................................</h1>
          </div>

          {/* Summary Table */}
          <div className="shadow p-2 w-full">
            <div className="text-sm">
              <h1 className="text-center font-semibold">Key To Follow</h1>
              <h2>
                <span className="font-semibold">A/P -</span> Absent With
                Permission
              </h2>
              <h2>
                <span className="font-semibold mr-2">A -</span> Absent
              </h2>
              <h2>
                <span className="font-semibold">A/L -</span> Annual Leave
              </h2>
              <h2>
                <span className="font-semibold">S/L -</span> Sick Leave
              </h2>
              <h2>
                <span className="font-semibold">M/L -</span> Maternity Leave
              </h2>
              <h2>
                <span className="font-semibold">L/P -</span> Late Without
                Permission
              </h2>
              <h2>
                <span className="font-semibold">G/P -</span> Going Back With
                Permission
              </h2>
              <h2>
                <span className="font-semibold">H/A -</span> Hospital Attendance
              </h2>
            </div>

            <h2 className="font-semibold mt-3 mb-1 text-center">Summary</h2>
            <table className="w-full text-sm border border-gray-500">
              <thead className="bg-blue-100 text-gray-800 ">
                <tr>
                  <th className="border  border-gray-500  py-0.5 text-center w-22">
                    Type
                  </th>
                  <th className="border  border-gray-500  py-0.5 text-center w-10">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                
                
              
               
                

                <tr>
                  <td className="border text-[12px] border-gray-300 px-1 py-0.5">
                    Total Absent
                  </td>
                  <td className="border border-gray-300 px-3 py- text-center">
                    {totalAbsent}
                  </td>
                </tr>

                <tr>
                  <td className="border text-[12px] border-gray-300 px-1 py-0.5">
                    Total Present
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    {totalPresent}
                  </td>
                </tr>
                 
                <tr className="h-5 border "></tr>


                <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">Annual Leave</td>
                  <td className="border border-gray-300 pl-1  text-center">
                    {(summary.LeaveDays) * 9 }
                  </td>
                </tr>


                <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">Sick Leave</td>
                  <td className="border border-gray-300  text-center">
                    {(summary.SickDays) * 9 }
                  </td>
                </tr>
 

                  <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">
                    Maternity Leave
                  </td>
                  <td className="border border-gray-300  text-center">
                    {(summary.MaternityDays) * 9}
                  </td>
                </tr>

                 <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">
                    Holidays
                  </td>
                  <td className="border border-gray-300  text-center">
                    {summary.HolidayDays}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">
                    Regular Hours
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    {totalRegularHours.toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">
                    Over Time (x1.5)
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    {overtimePayable.toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">
                    Sunday Hrs (x2)
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    {sundayPayable.toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 pl-1 py-0.5 font-semibold">
                    Night Allowance
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 pl-1 py-0.5 font-semibold">
                    Products
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 pl-1 py-0.5 font-semibold">
                    Leave Allowance
                  </td>
                  <td className="border border-gray-300   text-center">
                    
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PrintingMusterRollReport;
