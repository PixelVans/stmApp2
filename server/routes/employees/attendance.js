


const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

// Utility to normalize time strings (HH:mm:ss)
function normalizeTime(value) {
  if (
    !value ||
    value === "" ||
    value === "0000" ||
    value === "00:00" ||
    value === "00:00:00"
  ) {
    return null;
  }
  const match = value.match(/^([0-1]?\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/);
  if (!match) return null;

  const [h, m, s] = value.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s ? s.padStart(2, "0") : "00"}`;
}

router.post("/update", async (req, res) => {
  const {
    EmployeeID,
    Month,
    Year,
    AttendanceRecords,
    LeaveDays,
    SickDays,
    MaternityDays,
    NightshiftAllowance,
    ProductDeductions,
    LeaveAllowance,
    Adjustments, 
  } = req.body;

  if (!EmployeeID || !AttendanceRecords?.length) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const pool = await connectToDB2();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    
    // 1. Update Attendance table
    
    for (const record of AttendanceRecords) {
      const { AttendanceDate, TimeIn, TimeOut, DayOfWeek } = record;
      const safeTimeIn = normalizeTime(TimeIn);
      const safeTimeOut = normalizeTime(TimeOut);

      const req1 = new sql.Request(transaction);
      await req1
        .input("EmployeeID", sql.Int, EmployeeID)
        .input("AttendanceDate", sql.Date, AttendanceDate)
        .input("TimeIn", sql.VarChar(8), safeTimeIn)
        .input("TimeOut", sql.VarChar(8), safeTimeOut)
        .input("DayOfWeek", sql.VarChar(10), DayOfWeek || null)
        .query(`
          MERGE [Specialised Systems].dbo.Attendance AS target
          USING (SELECT @EmployeeID AS EmployeeID, @AttendanceDate AS AttendanceDate) AS source
          ON target.EmployeeID = source.EmployeeID AND target.AttendanceDate = source.AttendanceDate
          WHEN MATCHED THEN
            UPDATE SET 
              TimeIn = CASE WHEN TRY_CAST(@TimeIn AS TIME) IS NOT NULL THEN CAST(@TimeIn AS TIME) ELSE NULL END,
              TimeOut = CASE WHEN TRY_CAST(@TimeOut AS TIME) IS NOT NULL THEN CAST(@TimeOut AS TIME) ELSE NULL END,
              DayOfWeek = @DayOfWeek,
              TotalHours = CASE 
                WHEN TRY_CAST(@TimeIn AS TIME) IS NOT NULL AND TRY_CAST(@TimeOut AS TIME) IS NOT NULL THEN
                  CASE 
                    WHEN (
                      DATEDIFF(MINUTE, CAST(@TimeIn AS TIME), CAST(@TimeOut AS TIME))
                      + CASE WHEN @TimeOut < @TimeIn THEN 24 * 60 ELSE 0 END
                      - 30
                    ) < 0 THEN 0
                    ELSE CAST(
                      (
                        (DATEDIFF(MINUTE, CAST(@TimeIn AS TIME), CAST(@TimeOut AS TIME))
                          + CASE WHEN @TimeOut < @TimeIn THEN 24 * 60 ELSE 0 END
                          - 30
                        ) / 60.0
                      ) AS DECIMAL(10,2)
                    )
                  END
                ELSE NULL 
              END,
              UpdatedAt = GETDATE()
          WHEN NOT MATCHED THEN
            INSERT (EmployeeID, AttendanceDate, TimeIn, TimeOut, DayOfWeek, TotalHours)
            VALUES (
              @EmployeeID,
              @AttendanceDate,
              CASE WHEN TRY_CAST(@TimeIn AS TIME) IS NOT NULL THEN CAST(@TimeIn AS TIME) ELSE NULL END,
              CASE WHEN TRY_CAST(@TimeOut AS TIME) IS NOT NULL THEN CAST(@TimeOut AS TIME) ELSE NULL END,
              @DayOfWeek,
              CASE 
                WHEN TRY_CAST(@TimeIn AS TIME) IS NOT NULL AND TRY_CAST(@TimeOut AS TIME) IS NOT NULL THEN
                  CASE 
                    WHEN (
                      DATEDIFF(MINUTE, CAST(@TimeIn AS TIME), CAST(@TimeOut AS TIME))
                      + CASE WHEN @TimeOut < @TimeIn THEN 24 * 60 ELSE 0 END
                      - 30
                    ) < 0 THEN 0
                    ELSE CAST(
                      (
                        (DATEDIFF(MINUTE, CAST(@TimeIn AS TIME), CAST(@TimeOut AS TIME))
                          + CASE WHEN @TimeOut < @TimeIn THEN 24 * 60 ELSE 0 END
                          - 30
                        ) / 60.0
                      ) AS DECIMAL(10,2)
                    )
                  END
                ELSE NULL 
              END
            );
        `);
    }

    
    // 2. Update EmployeePayrolls table
 
    const currentYear = Number(Year) || new Date().getFullYear();
    const currentMonth = Number(Month) + 1;

    const req2 = new sql.Request(transaction);
    await req2
      .input("EmployeeID", sql.Int, EmployeeID)
      .input("Year", sql.Int, currentYear)
      .input("Month", sql.Int, currentMonth)
      .input("LeaveDays", sql.Int, LeaveDays || 0)
      .input("SickDays", sql.Int, SickDays || 0)
      .input("MaternityDays", sql.Int, MaternityDays || 0)
      .input("NightshiftAllowance", sql.Decimal(10, 2), NightshiftAllowance || 0)
      .input("ProductDeductions", sql.Decimal(10, 2), ProductDeductions || 0)
      .input("LeaveAllowance", sql.Decimal(10, 2), LeaveAllowance || 0)
      .query(`
        MERGE [Specialised Systems].dbo.EmployeePayrolls AS target
        USING (SELECT @EmployeeID AS EmployeeID, @Year AS Year, @Month AS Month) AS source
        ON target.EmployeeID = source.EmployeeID 
           AND YEAR(target.PayrollMonth) = source.Year
           AND MONTH(target.PayrollMonth) = source.Month
        WHEN MATCHED THEN
          UPDATE SET 
            LeaveDays = @LeaveDays,
            SickDays = @SickDays,
            MaternityDays = @MaternityDays,
            NightshiftAllowance = @NightshiftAllowance,
            ProductDeductions = @ProductDeductions,
            LeaveAllowance = @LeaveAllowance,
            UpdatedAt = GETDATE()
        WHEN NOT MATCHED THEN
          INSERT (EmployeeID, PayrollMonth, LeaveDays, SickDays, MaternityDays, NightshiftAllowance, ProductDeductions, LeaveAllowance)
          VALUES (
            @EmployeeID, 
            DATEFROMPARTS(@Year, @Month, 1), 
            @LeaveDays, 
            @SickDays, 
            @MaternityDays, 
            @NightshiftAllowance, 
            @ProductDeductions, 
            @LeaveAllowance
          );
      `);

    //  3. Get Payroll ID
    const req3 = new sql.Request(transaction);
    const payrollResult = await req3
      .input("EmployeeID", sql.Int, EmployeeID)
      .input("Year", sql.Int, currentYear)
      .input("Month", sql.Int, currentMonth)
      .query(`
        SELECT ID 
        FROM [Specialised Systems].dbo.EmployeePayrolls
        WHERE EmployeeID = @EmployeeID
          AND YEAR(PayrollMonth) = @Year
          AND MONTH(PayrollMonth) = @Month;
      `);

    const payrollRecord = payrollResult.recordset[0];
    if (payrollRecord && Adjustments?.length > 0) {
      const payrollID = payrollRecord.ID;

      // Clear old adjustments  before inserting new ones
      const clearReq = new sql.Request(transaction);
      await clearReq
        .input("PayrollID", sql.Int, payrollID)
        .query(`
          DELETE FROM [Specialised Systems].dbo.PayrollAdjustments 
          WHERE EmployeePayrollID = @PayrollID;
        `);

      // Insert all new adjustments
      for (const adj of Adjustments) {
        const { AdjustmentType, AdjustmentValue, Note } = adj;

        const adjReq = new sql.Request(transaction);
        await adjReq
          .input("PayrollID", sql.Int, payrollID)
          .input("AdjustmentType", sql.VarChar(20), AdjustmentType)
          .input("AdjustmentValue", sql.Decimal(10, 2), AdjustmentValue)
          .input("Note", sql.NVarChar(255), Note)
          .input("CreatedBy", sql.NVarChar(100), "system") 
          .query(`
            INSERT INTO [Specialised Systems].dbo.PayrollAdjustments 
              (EmployeePayrollID, AdjustmentType, AdjustmentValue, Note, CreatedBy)
            VALUES 
              (@PayrollID, @AdjustmentType, @AdjustmentValue, @Note, @CreatedBy);
          `);
      }
    }

    
    // Commit 
   
    await transaction.commit();
    res.json({ message: "Attendance, payroll, and adjustments successfully updated" });
  } catch (err) {
    console.error(" Error saving attendance:", err);
    res.status(500).json({ error: "Error saving attendance", details: err.message });
  }
});


router.delete("/delete-adjustment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await connectToDB2();
    await pool.request()
      .input("AdjustmentID", sql.Int, id)
      .query(`
        DELETE FROM [Specialised Systems].dbo.PayrollAdjustments
        WHERE AdjustmentID = @AdjustmentID
      `);

    res.json({ message: "Adjustment deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete adjustment" });
  }
});



module.exports = router;
