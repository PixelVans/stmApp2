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
    res.status(500).send("Error saving weaving  production data");
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
    if (type === "int") return isNaN(parseInt(val)) ? null : parseInt(val);
    if (type === "float") return isNaN(parseFloat(val)) ? null : parseFloat(val);
    return val;
  };

  try {
    const pool = await connectToDB2();

    /* ================= CHECK BY BEAM NUMBER ================= */
    const existing = await pool.request()
      .input("beam", sql.VarChar(50), String(beamNumber))
      .query(`
        SELECT ID
        FROM [Specialised Systems].dbo.WarpingData2025
        WHERE BeamNumber = @beam
      `);

    /* ================= UPDATE EXISTING ================= */
    if (existing.recordset.length > 0) {
      await pool.request()
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
        .input("beam", sql.VarChar(50), String(beamNumber))
        .query(`
          UPDATE [Specialised Systems].dbo.WarpingData2025
          SET 
            Date = @date,
            MachineNumber = @machineNumber,
            BeamPosition = @beamPosition,
            Article = @article,
            Yarn1 = @yarn1,
            Yarn2 = @yarn2,
            WeightofYarn1 = @weightYarn1,
            WeightofYarn2 = @weightYarn2,
            TotalEnds = @totalEnds,
            Meters = @meters,
            KnottingCounter = @knottingCounter
          WHERE BeamNumber = @beam
        `);

      return res.status(200).json({
        success: true,
        action: "updated",
        message: `Beam ${beamNumber} already existed. Data was updated instead.`,
        beamNumber,
      });
    }

    /* ================= INSERT NEW ================= */
    await pool.request()
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
      .query(`
        INSERT INTO [Specialised Systems].dbo.WarpingData2025
        (BeamNumber, Date, MachineNumber, BeamPosition, Article, Yarn1, Yarn2,
         WeightofYarn1, WeightofYarn2, TotalEnds, Meters, KnottingCounter)
        VALUES
        (@beamNumber, @date, @machineNumber, @beamPosition, @article,
         @yarn1, @yarn2, @weightYarn1, @weightYarn2,
         @totalEnds, @meters, @knottingCounter)
      `);

    return res.status(201).json({
      success: true,
      action: "inserted",
      message: "Warping data inserted successfully",
      beamNumber,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to save warping data",
      error: err.message,
    });
  }
});







router.get("/warp/by-date/:date", async (req, res) => {
  const { date } = req.params;
 
  try {
    
    const pool = await connectToDB2();

    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT *
        FROM [Specialised Systems].dbo.WarpingData2025
        WHERE Date = @date
      `);

    
    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching warping data by date");
  }
});




router.get("/warp/latest", async (req, res) => {
  try {
    const pool = await connectToDB2();
    

    const result = await pool.request().query(`
      SELECT TOP 10 *
      FROM [Specialised Systems].dbo.WarpingData2025
      WHERE BeamNumber IS NOT NULL
      ORDER BY Date DESC, ID DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching latest warping records:", err);
    res.status(500).send("Error fetching latest warping records");
  }
});





router.get("/warp/by-beam/:beamNumber", async (req, res) => {
  const { beamNumber } = req.params;

  try {
    const pool = await connectToDB2();
    console.log("Fetching warping data for beam number:", beamNumber);
    const result = await pool.request()
      .input("beamNumber", sql.VarChar(50), beamNumber)
      .query(`
        SELECT *
        FROM [Specialised Systems].dbo.WarpingData2025
        WHERE BeamNumber = @beamNumber
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Beam number not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching warping data by beam number");
  }
});






module.exports = router;
