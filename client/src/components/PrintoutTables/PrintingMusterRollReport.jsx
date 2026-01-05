import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiFileText, FiPrinter } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";



const PrintingMusterRollReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    LeaveDays: 0,
    SickDays: 0,
    MaternityDays: 0,
    HolidayDays: 0,
    NightshiftAllowance: "",
    ProductDeductions: "",
    LeaveAllowance: "",
});

  const [adjustments, setAdjustments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


   // Utility: Kenyan holidays calculator
const isKenyanHoliday = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; 
  const day = date.getDate();

  // Fixed holidays
  const fixedHolidays = [
    `${year}-1-1`,   // New Year's Day (January 1)
    `${year}-3-31`,   // Eid al-Fitr (End of Ramadan)
    `${year}-4-18`,   // Good Friday 
    `${year}-4-21`,  // Easter Monday 
    `${year}-5-1`,   // Labour Day (May Day)
    `${year}-6-1`,   // Madaraka Day (Kenyan Independence Day)
    `${year}-6-7`,   // Eid al-Adha (Feast of Sacrifice)
    `${year}-10-10`, // Mazingira Day (Environment Day)
    `${year}-10-20`, // Mashujaa Day (Heroes' Day)
    `${year}-12-12`, // Jamhuri Day (Republic Day)
    `${year}-12-25`, // Christmas (Christmas Day)
    `${year}-12-26`, // Boxing Day (Day of Goodwill)
  ];

  // Convert date to string form
  const dateStr = `${year}-${month}-${day}`;

  if (fixedHolidays.includes(dateStr)) return true;


  // Good Friday and Easter Monday – use Computus algorithm
  const easter = getEasterDate(year);
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  const moveable = [
    goodFriday.toDateString(),
    easterMonday.toDateString(),
  ];

  return moveable.includes(date.toDateString());
};

// Helper: Compute Easter Sunday (Western)
const getEasterDate = (year) => {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
};


// Utility: Safely format a UTC timestamp (e.g. "1970-01-01T07:00:00.000Z") as HH:MM
const formatTimeUTC = (timeStr) => {
  if (!timeStr) return "";
  const d = new Date(timeStr);
  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12
  return `${hours}:${minutes} ${ampm}`;
};



const formatHoursToHM = (decimalHours) => {
  if (decimalHours == null) return "";
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
};


const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "";
  return `Ksh ${new Intl.NumberFormat("en-KE").format(amount)}`;
};


  // Generate range from 27th of current month to 26th of next
 const generateDateRange = (year, month) => {
  const prevMonth = month === 0 ? 11 : month - 1;
  const rangeYear = month === 0 ? year - 1 : year;

  const startDate = new Date(Date.UTC(rangeYear, prevMonth, 26));
  const endDate = new Date(Date.UTC(year, month, 25));

  const dates = [];
  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    dates.push(new Date(d));
  }

  return dates;
};


 const [dateRange, setDateRange] = useState(
  generateDateRange(selectedYear, selectedMonth)
);

useEffect(() => {
  setDateRange(generateDateRange(selectedYear, selectedMonth));
}, [selectedMonth, selectedYear]);


  // Fetch employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
        setLoading(false);
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
    setLoading(true);
    setError(null); 

    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
const yearToSend = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

const res = await fetch(
  `/api/employees/report?employeeId=${selectedEmployee}&month=${prevMonth}&year=${yearToSend}`
);


    if (!res.ok) throw new Error("Failed to fetch muster roll report");

    const data = await res.json();
    //console.log( "fetched Report:", data)
    setAttendanceData(data.attendance || []);
    setSummary(data.summary || {});
    setAdjustments(data.adjustments || []);
  } catch (err) {
    //console.error(err);
    setError("Failed to load muster roll report. Please try again later.");
  } finally {
    setLoading(false);
  }
}



    fetchReport();
  }, [selectedEmployee, selectedMonth, selectedYear]);

  //  CALCULATIONS 
  const totalPresent = attendanceData.filter((r) => r.TimeIn).length;
  const totalAbsent = attendanceData.filter((r) => !r.TimeIn).length;

  // Group attendance data by ISO week (Monday–Saturday)
// Helper: group records by Monday–Saturday week blocks
const groupByWorkWeek = (records) => {
  const sorted = [...records].sort(
    (a, b) => new Date(a.AttendanceDate) - new Date(b.AttendanceDate)
  );

  const weeks = [];
  let currentWeek = [];

  for (let i = 0; i < sorted.length; i++) {
    const rec = sorted[i];
    if (!rec.AttendanceDate) continue;

    const date = new Date(rec.AttendanceDate);
    const day = date.getDay();

    // If it's Monday and we already have records, start a new week
    if (day === 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(rec);

    // If it's Saturday, push the current week
    if (day === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add last incomplete week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

// Calculate Weekly Overtime 
const weeks = groupByWorkWeek(attendanceData);

let totalRegularHours = 0;
let totalOvertimeHours = 0;

weeks.forEach((week) => {
  // Only include Monday–Saturday, but skip holidays
  const weeklyHours = week
    .filter((r) => {
      if (!r.TotalHours) return false;
      if (!["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(r.DayOfWeek)) return false;

      // exclude holidays from regular/overtime
      const date = new Date(r.AttendanceDate);
      if (isKenyanHoliday(date)) return false;

      return true;
    })
    .reduce((sum, r) => sum + r.TotalHours, 0);

  if (weeklyHours > 45) {
    totalRegularHours += 45;
    totalOvertimeHours += weeklyHours - 45;
  } else {
    totalRegularHours += weeklyHours;
  }
});

//  Apply all hour-based adjustments ONCE, after totals are computed

const overtimePayable = totalOvertimeHours * 1.5;
  const sundayHours = attendanceData
    .filter((r) => r.DayOfWeek === "Sun" && r.TotalHours)
    .reduce((sum, r) => sum + r.TotalHours, 0);
  const sundayPayable = sundayHours * 2;

  // Kenyan public holidays (×2 rule)
const holidayDates = dateRange.filter((d) => isKenyanHoliday(d));

let totalHolidayPayable = 0;

holidayDates.forEach((holiday) => {
  // Find record for that date
  const record = attendanceData.find(
    (r) => new Date(r.AttendanceDate).toDateString() === holiday.toDateString()
  );

  if (record && record.TotalHours) {
      // Worked → double the hours
      totalHolidayPayable += record.TotalHours * 2;
    } else {
      // Did not work → default 9 hours
      totalHolidayPayable += 9;
    }
  });



const holidayPayable = totalHolidayPayable;
const totalHours = attendanceData
    .filter((r) => r.TotalHours)
    .reduce((sum, r) => sum + r.TotalHours, 0);

// Each leave day to be equivalent to 9 hours (standard work day)
const leaveHours = (summary.LeaveDays || 0) * 9;
const sickHours = (summary.SickDays || 0) * 9;
const maternityHours = (summary.MaternityDays || 0) * 9;


// Aggregate adjustments of hours
const totalHoursAdj = adjustments
  .filter(adj => adj.AdjustmentType?.toLowerCase() === "hours")
  .reduce((sum, adj) => sum + (Number(adj.AdjustmentValue) || 0), 0);


// Combine everything for final total payable hours
const totalPayableHours =
          totalRegularHours +
          overtimePayable +
          sundayPayable +
          holidayPayable +
          leaveHours +
          sickHours +
          maternityHours +
          totalHoursAdj;



  //  DYNAMIC HEADER VALUES 
  const selectedEmp = employees.find(
    (emp) => emp.EmployeeID === Number(selectedEmployee)
  );
  const employeeName = selectedEmp
    ? `${selectedEmp.FirstName} ${selectedEmp.LastName}`
    : "—";
  const employeeId = selectedEmp ? selectedEmp.EmployeeID : "—";
      const monthLabel = new Date(selectedYear, selectedMonth).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });


 if (loading) {
      return (
      <div className="flex flex-col mt-[170px] items-center justify-center  bg-white">
         {/* Header */}
        
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
          Loading Muster Roll Report...
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


  if (error) {
  return (
    <div className="flex flex-col mt-[-120px] items-center justify-center h-screen">
      <div className="text-red-500 mb-3">
        <FiFileText className="w-10 h-10 mx-auto" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Server Error</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Retry
      </button>
    </div>
  );
}

  
  return (
    <div className="bg-white min-h-screen  text-gray-800 ">
      <Toaster position="top-center" richColors />

    {/* Header */}
        <header className="print:hidden fixed top-14 lg:top-0 left-0 right-0 lg:ml-[250px] xl:ml-[265px]  z-10 lg:z-40
         bg-white border-b border-gray-200 shadow-sm mb-6">
          
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <FiFileText className="text-indigo-500 w-6 h-6" />
              <h1 className="xl:text-xl font-semibold text-gray-800 tracking-tight">
                Muster Roll Report
                <Link
                to="/update-muster-roll"
                className="inline-flex  items-center group gap-1 text-sm font-semibold text-blue-800 ml-5 hover:text-blue-500 underline"
              >
                <FiArrowLeft className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-[-7px]" />
                Back to Update
              </Link>

              </h1>
              
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Employee Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Employee:</label>
                <select
                  className="border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                >
                  <option value="">Select...</option>
                  {employees.map((emp) => (
                    <option key={emp.EmployeeID} value={emp.EmployeeID}>
                      {emp.FirstName} {emp.LastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Month:</label>
                <select
                  className="border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
                <label className="text-sm font-medium text-gray-700"> Year: </label>
                <select
                  className="border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from({ length: 6 }, (_, i) => {
                    const year = new Date().getFullYear() - i + 1; 
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              {/* Print Button */}
              <button
                onClick={() => window.print()}
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm"
              >
                <FiPrinter className="w-4 h-4" />
                Print Report
              </button>
            </div>
          </div>
        </header>



      {/* Dynamic Form Header Section */}
      <div className="max-w-4xl mx-auto  lg:mt-5 p-8 print:mt-5 overflow-visible print:border-0 print:shadow-none border border-gray-400 mb-5 shadow-sm">
        <h1 className="text-center font-bold  mt-2 ">SPECIALISED TOWEL MANUFACTURERS LTD.</h1>
        <h4 className="text-center font-bold text-xs mb-4" >MUSTEROLL REPORT.</h4>

      <div className="text-center mb-6 ">
        <div className="flex justify-center items-center gap-20">
          <div className="border-1 border-slate-300  px-4 text-sm ">
            <label className="font-semibold mr-2">Name:</label>
            <span>{employeeName}</span>
          </div>
          <div className="border-1 border-slate-300  px-4 text-sm ">
            <label className="font-semibold mr-2">Form No:</label>
            <span>{employeeId}</span>
          </div>
        </div>
        <div className="border-1 border-slate-300  px-4  mx-auto mt-2 w-64 text-sm ">
          <label className="font-semibold mr-2">Month:</label>
          <span>{monthLabel}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className=" rounded-lg ">
        <div className="grid grid-cols-3 gap-2 items-start">
          {/* Attendance Table */}
          <div className="col-span-2   overflow-hidden ">
            <table className="w-full text-xs border border-gray-300">
              <thead className="bg-blue-100 text-gray-800 uppercase">
                <tr>
                  <th className="border border-gray-500 py-[1.5px]  text-center w-10">
                    Day
                  </th>
                  <th className="border border-gray-500  py-[1.5px] text-center w-10">
                    Date
                  </th>
                  <th className="border border-gray-500 py-[1.5px]  text-center w-10">
                    Time In
                  </th>
                  <th className="border border-gray-500 py-[1.5px]  text-center w-10">
                    Time Out
                  </th>
                  <th className="border border-gray-500  py-[1.5px] text-center w-10">
                    Total Hrs
                  </th>
                </tr>
              </thead>


           <tbody>
            {dateRange.map((date, index) => {
              const record =
                attendanceData.find((r) => {
                  if (!r.AttendanceDate) return false;

                  const db = new Date(r.AttendanceDate);
                  return (
                    db.getUTCFullYear() === date.getUTCFullYear() &&
                    db.getUTCMonth() === date.getUTCMonth() &&
                    db.getUTCDate() === date.getUTCDate()
                  );
                }) || {};


              const dayName = new Date(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
              ).toLocaleDateString("en-US", { weekday: "short" });


              return (
                <React.Fragment key={index}>
                  <tr className={`border border-gray-500 px-1 text-xs font-medium text-center ${
                        isKenyanHoliday(date) ? " border border-green-400" : ""
                      }`}>
                    <td
                      className={`border border-gray-500 px-1 text-xs font-medium text-center ${
                        isKenyanHoliday(date) ? "bg-green-400" : ""
                      }`}
                      title={isKenyanHoliday(date) ? "Public Holiday" : ""}
                    >
                      {dayName}
                    </td>

                    <td className="border border-gray-500 text-[12px] py-[1px] text-center">
                      {`${date.getDate()}/${date.getMonth() + 1}`}
                    </td>

                    <td className="border border-gray-500 text-[12px] text-gray-600 text-center">
                        {formatTimeUTC(record?.TimeIn)}
                      </td>

                      <td className="border border-gray-500 text-[12px] text-gray-600 text-center">
                        {formatTimeUTC(record?.TimeOut)}
                      </td>


                    <td className="border border-gray-500 text-[12px] text-center">
                      {formatHoursToHM(record?.TotalHours)}
                    </td>

                  </tr>

                  {dayName === "Sun" && (
                    <tr>
                      <td colSpan="5">
                        <div className="h-3 bg-gray-100" />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

              <tr className="bg-blue-50 font-semibold">
                <td colSpan="4" className="border border-gray-500 px-3 text-[12px] py-[1px]">
                  Monthly Total (Payable Hours)
                </td>
                <td className="border border-gray-500 px-3 py-1 text-center">
                  {Math.round(totalPayableHours * 100) / 100}

                </td>
              </tr>

          </tbody>
          </table>
          <div className="flex  justify-center gap-3 mt-12 mb-5">
          <h1 className="font-semibold whitespace-nowrap">Employee Signature</h1>
          <div className="w-52 border-b-2 border-dotted border-gray-500"></div>
        </div>

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
                  <th className="border  border-gray-500  py-[1px] text-center w-22">
                    Type
                  </th>
                  <th className="border  border-gray-500  py-[1px] text-center w-10">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                 

                <tr>
                  <td className="border text-[12px] border-gray-300 px-1 py-0.5">
                    Days Present
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    {totalPresent}
                  </td>
                </tr>
                 
                <tr className="h-5 border "></tr>


                <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">Annual Leave</td>
                  <td className="border border-gray-300 pl-1  text-center">
                    {(Number(summary.LeaveDays) || 0) * 9}
                  </td>
                </tr>


                <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">Sick Leave</td>
                  <td className="border border-gray-300  text-center">
                    {(Number(summary.SickDays) || 0) * 9}
                  </td>
                </tr>
 

                  <tr>
                  <td className="border border-gray-300  pl-1 py-0.5 font-semibold">
                    Maternity Leave
                  </td>
                  <td className="border border-gray-300  text-center">
                    {(Number(summary.MaternityDays) || 0) * 9}
                  </td>
                </tr>

                 <tr>
                <td className="border border-gray-300  pl-1 py-0.5 font-semibold">
                  Holidays (x2)
                </td>
                <td className="border border-gray-300  text-center">
                  {holidayPayable.toFixed(2)}
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
                    {formatCurrency(summary.NightshiftAllowance)}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 pl-1  py-0.5 font-semibold">
                    Products
                  </td>
                  <td className="border border-gray-300  py- text-center">
                    {formatCurrency(summary.ProductDeductions)}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 pl-1 py-0.5 font-semibold">
                    Leave Allowance
                  </td>
                  <td className="border border-gray-300   text-center">
                     {formatCurrency(summary.LeaveAllowance)}
                  </td>
                </tr>
                {adjustments?.length > 0 && (() => {
                // Aggregate Adjustments by Type
                const totalHoursAdj = adjustments
                  .filter(adj => adj.AdjustmentType?.toLowerCase() === "hours")
                  .reduce((sum, adj) => sum + (Number(adj.AdjustmentValue) || 0), 0);

                const totalAmountAdj = adjustments
                  .filter(adj => adj.AdjustmentType?.toLowerCase() === "amount")
                  .reduce((sum, adj) => sum + (Number(adj.AdjustmentValue) || 0), 0);

                // Figure out which types exist
                const hasHours = totalHoursAdj !== 0;
                const hasAmount = totalAmountAdj !== 0;

                return (
                  <>
                    {/* Full-width centered heading */}
                    <tr>
                      <td colSpan="2" className="text-center font-semibold text-sm py-1">
                        Adjustments
                      </td>
                    </tr>
                    {/* Dynamically show each adjustment type */}
                    {hasHours && (
                      <tr>
                        <td className="border border-gray-300 pl-1 py-0.5 font-semibold">
                          Hours
                        </td>
                        <td className="border border-gray-300 text-center">
                          {totalHoursAdj > 0 ? "+" : ""}
                          {totalHoursAdj} hrs
                        </td>
                      </tr>
                    )}

                    {hasAmount && (
                      <tr>
                        <td className="border border-gray-300 pl-1 py-0.5 font-semibold">
                          Amount
                        </td>
                        <td className="border border-gray-300 text-center">
                          {totalAmountAdj > 0 ? "+" : ""}
                          {totalAmountAdj} Ksh
                        </td>
                      </tr>
                    )}

                    {/* In case no adjustments exist (all zero) */}
                    {!hasHours && !hasAmount && (
                      <tr>
                        <td
                          colSpan="2"
                          className="border border-gray-300 text-center text-gray-500 py-0.5"
                        >
                          No adjustments
                        </td>
                      </tr>
                    )}
                  </>
                );
              })()}

              </tbody>
            </table>
          </div>
         </div>
        
      </div>
       {adjustments?.length > 0 && (
        <div className="mt-20 w-full">
          <h2 className="font-semibold mb-20 h-10 text-center"></h2>
          <h2 className="font-semibold mb-2 text-center print:mt-20">Adjustment Details</h2>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 py-1 px-2 text-center">Type</th>
                <th className="border border-gray-300 py-1 px-2 text-center">Value</th>
                <th className="border border-gray-300 py-1 px-2 text-center">Note</th>
                
                <th className="border border-gray-300 py-1 px-2 text-center">Created At</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adj, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 py-1 px-2 text-center">
                    {adj.AdjustmentType}

                  </td>
                  <td className="border border-gray-300 py-1 px-2 text-center">
                    {adj.Type?.toLowerCase() === "hours"
                      ? `${adj.AdjustmentValue > 0 ? "+" : ""}${adj.AdjustmentValue}`
                      : `${adj.AdjustmentValue > 0 ? "+" : ""}${adj.AdjustmentValue}`}
                  </td>
                  <td className="border border-gray-300 py-1 px-2 text-center">
                    {adj.Note || "-"}
                  </td>
                  
                  <td className="border border-gray-300 py-1 px-2 text-center">
                    {new Date(adj.CreatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>



      <style>
        {`
          @page {
            size: A4;
            margin: 0mm 2mm 0mm 2mm; /* top, right, bottom, left */
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact; /* ensures background colors print */
            }

            /* Example: tighten up your card content margins */
            .print-card {
              margin: 0;
              padding: 10mm;
            }

            /* Optional: remove shadows/borders if you want a clean print */
            .no-print-shadow {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>


  </div>

    
  );
};




export default PrintingMusterRollReport;
