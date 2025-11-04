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

  // PayrollMonth = one month ahead of the attendance period (to match your MERGE logic)
  const payrollMonth = new Date(year, selectedMonth + 2, 1); 

  try {
    const pool = await connectToDB2();

    const [attendance, summary, adjustments] = await Promise.all([
      // 1️⃣ Attendance records
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

      // 2️⃣ Payroll summary (match by month & year)
      pool.request()
        .input("EmployeeID", sql.Int, employeeId)
        .input("Year", sql.Int, year)
        .input("Month", sql.Int, selectedMonth + 2) // +1 for 0-based JS month, +1 again for payroll offset
        .query(`
          SELECT 
            ID AS PayrollID,
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
        `),
    ]);

    // 3️⃣ Fetch Adjustments linked to this payroll record (if exists)
    let adjustmentsData = [];
    const payrollRecord = summary.recordset[0];
    if (payrollRecord?.PayrollID) {
      const adjResult = await pool.request()
        .input("PayrollID", sql.Int, payrollRecord.PayrollID)
        .query(`
          SELECT 
            AdjustmentID,
            AdjustmentType,
            AdjustmentValue,
            Note,
            CreatedAt,
            CreatedBy
          FROM [Specialised Systems].dbo.PayrollAdjustments
          WHERE EmployeePayrollID = @PayrollID
          ORDER BY CreatedAt DESC;
        `);
      adjustmentsData = adjResult.recordset;
    }

    // ✅ Return everything together
    res.json({
      attendance: attendance.recordset,
      summary: payrollRecord || {},
      adjustments: adjustmentsData,
    });

  } catch (err) {
    console.error("❌ Report error:", err);
    res.status(500).json({ error: "Error fetching report", details: err.message });
  }
});



module.exports = router;
