const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require('../../config/db'); 

// fetch the whole week row
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


// FETCH the Knotting counter row
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



module.exports = router;
