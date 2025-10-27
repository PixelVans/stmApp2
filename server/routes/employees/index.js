const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

//
// ==========================
// GET all employees
// ==========================
router.get("/", async (req, res) => {
  try {
    const pool = await connectToDB2();

    const result = await pool.request().query(`
      SELECT 
        EmployeeID, 
        EmployerCode, 
        FirstName, 
        LastName 
      FROM [Specialised Systems].dbo.Employees
      ORDER BY EmployeeID
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send("Error fetching employees data");
  }
});

//
// ==========================
// GET Employee Report
// /api/employees/report?employeeId=1&month=9
// ==========================
router.get("/report", async (req, res) => {
  let { employeeId, month, year } = req.query;

  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID required" });
  }

  const selectedMonth = Number(month);
  year = Number(year) || new Date().getFullYear(); 

  // Handle payroll and date range
  const startDate = new Date(year, selectedMonth, 27);
  const endDate = new Date(year, selectedMonth + 1, 26);

  const payrollDate = new Date(year, selectedMonth + 2, 1);

  const payrollMonth = payrollDate.toISOString().slice(0, 10);
  console.log('selectedMonth:', selectedMonth);
  

  try {
    const pool = await connectToDB2();

    const [attendance, summary] = await Promise.all([
      // Attendance records
      pool.request()
        .input("EmployeeID", sql.Int, employeeId)
        .input("StartDate", sql.Date, startDate)
        .input("EndDate", sql.Date, endDate)
        .query(`
          SELECT 
            AttendanceDate,
            DayOfWeek,          
            TimeIn,
            TimeOut,
            TotalHours
          FROM [Specialised Systems].dbo.Attendance
          WHERE EmployeeID = @EmployeeID
            AND AttendanceDate BETWEEN @StartDate AND @EndDate
          ORDER BY AttendanceDate
        `),

//  Payroll summary (match by month & year, not full date)
pool.request()
  .input("EmployeeID", sql.Int, employeeId)
  .input("Year", sql.Int, year)
  .input("Month", sql.Int, selectedMonth + 2  ) // +1 because JS months are 0-based
  .query(`
    SELECT 
      LeaveDays, 
      SickDays, 
      MaternityDays, 
      NightshiftAllowance,
      ProductDeductions,
      LeaveAllowance
    FROM [Specialised Systems].dbo.EmployeePayrolls
    WHERE EmployeeID = @EmployeeID
      AND YEAR(PayrollMonth) = @Year
      AND MONTH(PayrollMonth) = @Month
  `)

    ]);

    res.json({
      attendance: attendance.recordset,
      summary: summary.recordset[0] || {},
    });
  } catch (err) {
    console.error(" Report error:", err);
    res.status(500).json({ error: "Error fetching report", details: err.message });
  }
});


module.exports = router;
