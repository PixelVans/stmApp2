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



// update weaving data
router.post("/update-weaving-data", async (req, res) => {
  const {
    weekNo,
    day,
    machineNo,
    machineReadingShiftA,
    machineReadingShiftB,
    stopReasonShiftA,
    stopReasonShiftB,
    article,
    counter, 
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
      article: `Article${machineNo}`,
      counter: `Counter${machineNo}B`, 
    };

    // check if row exists
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

      // UPDATE path
      let updateQuery = `
        UPDATE [Specialised Systems].dbo.ProductionData2025
        SET 
          ${cols.shiftA} = @machineReadingShiftA,
          ${cols.shiftB} = @machineReadingShiftB,
          ${cols.notesA} = @stopReasonShiftA,
          ${cols.notesB} = @stopReasonShiftB,
          ${cols.counter} = @counter
      `;

      if (normalize(article)) {
        updateQuery += `, ${cols.article} = @article`;
      }

      updateQuery += ` WHERE WeekNo = @weekNo AND Day = @day`;

      const reqUpdate = pool
        .request()
        .input("weekNo", sql.Int, weekNo)
        .input("day", sql.VarChar(10), day)
        .input(
          "machineReadingShiftA",
          sql.VarChar(50),
          normalize(machineReadingShiftA)
        )
        .input(
          "machineReadingShiftB",
          sql.VarChar(50),
          normalize(machineReadingShiftB)
        )
        .input("stopReasonShiftA", sql.VarChar(255), normalize(stopReasonShiftA))
        .input("stopReasonShiftB", sql.VarChar(255), normalize(stopReasonShiftB))
        .input("counter", sql.Int, normalize(counter, "int"));

      if (normalize(article)) {
        reqUpdate.input("article", sql.VarChar(255), article);
      }

      await reqUpdate.query(updateQuery);

      return res.json({ message: "Production data updated successfully" });
    } else {

      // INSERT path
      let insertCols = `
        WeekNo, Day, ${cols.shiftA}, ${cols.shiftB}, ${cols.notesA}, ${cols.notesB}, ${cols.counter}
      `;
      let insertVals = `
        @weekNo, @day, @machineReadingShiftA, @machineReadingShiftB,
        @stopReasonShiftA, @stopReasonShiftB, @counter
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
        .input(
          "machineReadingShiftA",
          sql.VarChar(50),
          normalize(machineReadingShiftA)
        )
        .input(
          "machineReadingShiftB",
          sql.VarChar(50),
          normalize(machineReadingShiftB)
        )
        .input("stopReasonShiftA", sql.VarChar(255), normalize(stopReasonShiftA))
        .input("stopReasonShiftB", sql.VarChar(255), normalize(stopReasonShiftB))
        .input("counter", sql.Int, normalize(counter, "int")); 

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





// update warping data
router.post("/update-warping-data", async (req, res) => {
  const {
    beamNumber,
    date,
    machineNumber,
    beamPosition,
    article,
    yarnCount1,
    yarnCount2,
    weightYarn1,
    weightYarn2,
    totalEnds,
    meters,
    beamUnitCounter,
  } = req.body;

  const normalize = (val, type = "string") => {
    if (val === undefined || val === null || val === "") return null;
    if (type === "int") {
      const parsed = parseInt(val, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    if (type === "float") {
      const parsed = parseFloat(val);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return val;
  };

  
  try {
    const pool = await connectToDB2();

    const insertQuery = `
      INSERT INTO [Specialised Systems].dbo.WarpingData2025
        (BeamNumber, Date, MachineNumber, BeamPosition, Article, Yarn1, Yarn2, 
         WeightofYarn1, WeightofYarn2, TotalEnds, Meters, KnottingCounter)
      VALUES
        (@beamNumber, @date, @machineNumber, @beamPosition, @article, @yarn1, @yarn2,
         @weightYarn1, @weightYarn2, @totalEnds, @meters, @knottingCounter)
    `;


    
    await pool
      .request()
      .input("beamNumber", sql.VarChar(50), normalize(beamNumber))
      .input("date", sql.Date, normalize(date))
      .input("machineNumber", sql.Int, normalize(machineNumber, "int"))
      .input("beamPosition", sql.VarChar(50), normalize(beamPosition))
      .input("article", sql.VarChar(255), normalize(article))
      .input("yarn1", sql.VarChar(50), normalize(yarnCount1))
      .input("yarn2", sql.VarChar(50), normalize(yarnCount2))
      .input("weightYarn1", sql.Float, normalize(weightYarn1, "float"))
      .input("weightYarn2", sql.Float, normalize(weightYarn2, "float"))
      .input("totalEnds", sql.Int, normalize(totalEnds, "int"))
      .input("meters", sql.Float, normalize(meters, "float"))
      .input("knottingCounter", sql.Int, normalize(beamUnitCounter, "int"))
      .query(insertQuery);

    res.json({ message: "Warping data saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving warping data");
  }
});






module.exports = router;
