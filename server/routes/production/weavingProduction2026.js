const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

// GET production by week
router.get("/week/:weeknumber", async (req, res) => {
  const { weeknumber } = req.params;
  const { year } = req.query;

  // default year → current year
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  try {
    const pool = await connectToDB2();

    const result = await pool
      .request()
      .input("weeknumber", sql.Int, parseInt(weeknumber))
      .input("year", sql.Int, targetYear)
      .query(`
        SELECT *
        FROM [Specialised Systems].dbo.WeavingProductionData
        WHERE WeekNo = @weeknumber
          AND [Year] = @year
        ORDER BY MachineNo, [Day], Shift
      `);

    // EMPTY ≠ ERROR
    return res.status(200).json(result.recordset || []);
  } catch (err) {
    console.error("Weaving production fetch failed:", err);
    res.status(500).json({
      message: "Error fetching weaving production rows",
    });
  }
});


// POST insert/update weaving production (accepts array of shift rows)
router.post("/update-weaving-data", async (req, res) => {
  const dataRows = req.body;

  if (!Array.isArray(dataRows) || dataRows.length === 0) {
    return res.status(400).json({ message: "No production data provided" });
  }

  const normalize = (val, type = "string") => {
    if (val === undefined || val === null || val === "") return null;
    if (type === "int") {
      const parsed = parseInt(val, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return val;
  };

  try {
    const pool = await connectToDB2();

    for (const row of dataRows) {
      const {
        MachineNo,
        Shift,
        UnitsProduced,
        BeamUsed,
        Notes,
        Counter,
        Article,
        Day,
        WeekNo,
        Month,
        Date,
        Year,
      } = row;

      if (!MachineNo || !Shift || !WeekNo || !Day || !Date) continue;

      const finalYear = Year ?? new Date().getFullYear();

      await pool
        .request()
        .input("MachineNo", sql.Int, MachineNo)
        .input("Shift", sql.Char(1), Shift)
        .input("WeekNo", sql.Int, WeekNo)
        .input("Day", sql.NVarChar(20), Day)
        .input("Year", sql.Int, finalYear)
        .input("UnitsProduced", sql.Int, normalize(UnitsProduced, "int"))
        .input("Notes", sql.NVarChar(200), normalize(Notes))
        .input("Beam", sql.NVarChar(50), normalize(BeamUsed))
        .input("Counter", sql.Int, normalize(Counter, "int"))
        .input("Article", sql.NVarChar(100), normalize(Article))
        .input("Month", sql.Int, normalize(Month, "int"))
        .input("Date", sql.Date, Date)
        .query(`
          MERGE [Specialised Systems].dbo.WeavingProductionData AS target
          USING (SELECT
            @MachineNo AS MachineNo,
            @Shift AS Shift,
            @WeekNo AS WeekNo,
            @Day AS Day,
            @Year AS Year
          ) AS source
          ON (
            target.MachineNo = source.MachineNo
            AND target.Shift = source.Shift
            AND target.WeekNo = source.WeekNo
            AND target.Day = source.Day
            AND target.Year = source.Year
          )
          WHEN MATCHED THEN
            UPDATE SET
              UnitsProduced = @UnitsProduced,
              Notes = @Notes,
              Beam = @Beam,
              Counter = @Counter,
              Article = @Article,
              Month = @Month,
              Date = @Date
          WHEN NOT MATCHED THEN
            INSERT (
              MachineNo, Shift, UnitsProduced, Notes, Beam,
              Counter, Article, WeekNo, Month, Day, Date, Year
            )
            VALUES (
              @MachineNo, @Shift, @UnitsProduced, @Notes, @Beam,
              @Counter, @Article, @WeekNo, @Month, @Day, @Date, @Year
            );
        `);
    }

    res.json({ message: "Production data saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving weaving production data");
  }
});




module.exports = router;


