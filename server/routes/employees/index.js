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
  const { employeeId, month } = req.query;
  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID required" });
  }

  const year = new Date().getFullYear();
  let selectedMonth = Number(month);
  employeePayrollMonth = selectedMonth + 2 
  console.log("payroll month selected was", employeePayrollMonth)
  // 27th of selected month to 26th of next month
  const startDate = new Date(year, selectedMonth, 27);
  const endDate = new Date(year, selectedMonth + 1, 26);

  // Payroll reference month
  const payrollMonth = `${year}-${String(employeePayrollMonth).padStart(2, "0")}-01`;
  console.log("payroll month used:", payrollMonth);
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

      // Payroll summary (updated — removed HolidayDays, added 3 new fields)
      pool.request()
        .input("EmployeeID", sql.Int, employeeId)
        .input("PayrollMonth", sql.Date, payrollMonth)
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
            AND PayrollMonth = @PayrollMonth
        `)
    ]);

    res.json({
      attendance: attendance.recordset,
      summary: summary.recordset[0] || {},
    });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Error fetching report", details: err.message });
  }
});

module.exports = router;
