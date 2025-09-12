const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require('../../config/db'); 


router.get("/week/:weeknumber", async (req, res) => {
  const { weeknumber } = req.params;
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .input("weeknumber", sql.Int, weeknumber) 
      .query("SELECT * FROM [Specialised Systems].dbo.ProductionData2025 WHERE WeekNo = @weeknumber");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "week number not found" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching weaving production rows");
  }
});



router.get("/beam/:beamnumber", async (req, res) => {
  const { beamnumber } = req.params;
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .input("beamnumber", sql.Int, beamnumber) 
      .query("SELECT * FROM [Specialised Systems].dbo.WarpingData2025 WHERE BeamNumber = @beamnumber");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "beam number not found" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching warping data rows");
  }
});



router.post("/update-weaving-report", async (req, res) => {
  const {
    weekNo,
    day,
    machineNo,
    machineReadingShiftA,
    machineReadingShiftB,
    stopReasonShiftA,
    stopReasonShiftB,
    beamNoShiftA,
    beamNoShiftB,
    counterShiftA,
    counterShiftB,
    article,
  } = req.body;

  
  const normalize = (val, type = "string") => {
    if (val === undefined || val === null || val === "") return null;
    if (type === "int") {
      const parsed = parseInt(val, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return val;
  };

  try {
    if (!weekNo || !day || !machineNo) {
      return res
        .status(400)
        .json({ message: "weekNo, day, and machineNo are required" });
    }

    const pool = await connectToDB2();

    
    const prefix = `Mach${machineNo}`;
    const cols = {
      shiftA: `${prefix}ShiftA`,
      shiftB: `${prefix}ShiftB`,
      notesA: `Notes${machineNo}A`,
      notesB: `Notes${machineNo}B`,
      counterA: `Counter${machineNo}A`,
      counterB: `Counter${machineNo}B`,
      beamA: `Beam${machineNo}A`,
      beamB: `Beam${machineNo}B`,
      article: `Article${machineNo}`,
    };

    
    const existing = await pool
      .request()
      .input("weekNo", sql.Int, weekNo)
      .input("day", sql.VarChar(10), day)
      .query(`
        SELECT ID 
        FROM [Specialised Systems].dbo.ProductionData2025 
        WHERE WeekNo = @weekNo AND Day = @day
      `);

    if (existing.recordset.length > 0) {
      
      let updateQuery = `
        UPDATE [Specialised Systems].dbo.ProductionData2025
        SET 
          ${cols.shiftA} = @machineReadingShiftA,
          ${cols.shiftB} = @machineReadingShiftB,
          ${cols.notesA} = @stopReasonShiftA,
          ${cols.notesB} = @stopReasonShiftB,
          ${cols.counterA} = @counterShiftA,
          ${cols.counterB} = @counterShiftB,
          ${cols.beamA} = @beamNoShiftA,
          ${cols.beamB} = @beamNoShiftB
      `;

      if (normalize(article)) {
        updateQuery += `, ${cols.article} = @article`;
      }

      updateQuery += ` WHERE WeekNo = @weekNo AND Day = @day`;

      const reqUpdate = pool
        .request()
        .input("weekNo", sql.Int, weekNo)
        .input("day", sql.VarChar(10), day)
        .input("machineReadingShiftA", sql.VarChar(50), normalize(machineReadingShiftA))
        .input("machineReadingShiftB", sql.VarChar(50), normalize(machineReadingShiftB))
        .input("stopReasonShiftA", sql.VarChar(255), normalize(stopReasonShiftA))
        .input("stopReasonShiftB", sql.VarChar(255), normalize(stopReasonShiftB))
        .input("counterShiftA", sql.Int, normalize(counterShiftA, "int"))
        .input("counterShiftB", sql.Int, normalize(counterShiftB, "int"))
        .input("beamNoShiftA", sql.VarChar(50), normalize(beamNoShiftA))
        .input("beamNoShiftB", sql.VarChar(50), normalize(beamNoShiftB));

      if (normalize(article)) {
        reqUpdate.input("article", sql.VarChar(255), article);
      }

      await reqUpdate.query(updateQuery);

      return res.json({ message: "Production data updated successfully" });
    } else {
      
      let insertCols = `
        WeekNo, Day, ${cols.shiftA}, ${cols.shiftB}, ${cols.notesA}, ${cols.notesB},
        ${cols.counterA}, ${cols.counterB}, ${cols.beamA}, ${cols.beamB}
      `;
      let insertVals = `
        @weekNo, @day, @machineReadingShiftA, @machineReadingShiftB,
        @stopReasonShiftA, @stopReasonShiftB, @counterShiftA, @counterShiftB,
        @beamNoShiftA, @beamNoShiftB
      `;

      if (normalize(article)) {
        insertCols += `, ${cols.article}`;
        insertVals += `, @article`;
      }

      const insertQuery = `
        INSERT INTO [Specialised Systems].dbo.ProductionData2025 (${insertCols})
        VALUES (${insertVals})
      `;

      const reqInsert = pool
        .request()
        .input("weekNo", sql.Int, weekNo)
        .input("day", sql.VarChar(10), day)
        .input("machineReadingShiftA", sql.VarChar(50), normalize(machineReadingShiftA))
        .input("machineReadingShiftB", sql.VarChar(50), normalize(machineReadingShiftB))
        .input("stopReasonShiftA", sql.VarChar(255), normalize(stopReasonShiftA))
        .input("stopReasonShiftB", sql.VarChar(255), normalize(stopReasonShiftB))
        .input("counterShiftA", sql.Int, normalize(counterShiftA, "int"))
        .input("counterShiftB", sql.Int, normalize(counterShiftB, "int"))
        .input("beamNoShiftA", sql.VarChar(50), normalize(beamNoShiftA))
        .input("beamNoShiftB", sql.VarChar(50), normalize(beamNoShiftB));

      if (normalize(article)) {
        reqInsert.input("article", sql.VarChar(255), article);
      }

      await reqInsert.query(insertQuery);

      return res.json({ message: "Production data inserted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving weaving production data");
  }
});




module.exports = router;
