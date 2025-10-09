import React, { useEffect, useState } from "react";

export default function UpdateMusterRoll() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  // Generate dates from 25th of current month to 26th of next month
  const generateDateRange = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 26);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 27);

    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const dateRange = generateDateRange();

  // Fetch all employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployees();
  }, []);

  // Handle time changes
  const handleTimeChange = (index, field, value) => {
    const updated = [...attendanceData];
    updated[index] = { ...updated[index], [field]: value };
    setAttendanceData(updated);
  };

  // Helper: check if date is Sunday to insert week break
  const isSunday = (date) => date.getDay() === 0; 

  return (
    <div className="p-6 hidden bg-gray-50 min-h-screen">
      <h1 className="text-3xl  text-center mx-auto font-semibold text-gray-800 mb-6">
        Update Muster Roll
      </h1>

      {/* Employee Selector */}
      <div className="flex items-center mx-auto gap-3 mb-6">
        <label className="font-medium  text-gray-700">Select Employee:</label>
        <select
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp.ID} value={emp.ID}>
              {emp.FirstName} {emp.LastName}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Table */}
      <div className="bg-white max-w-xl rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-blue-100 text-gray-700 uppercase">
            <tr>
              <th className="px-3 py-2 text-left w-24">Day</th>
              <th className="px-3 py-2 text-left w-32">Date</th>
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

                {/* Week Break */}
                {isSunday(date) && (
                  <tr>
                    <td colSpan="4" className="bg-gray-200 h-2"></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => console.log("Save attendance", attendanceData)}
          className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
}
