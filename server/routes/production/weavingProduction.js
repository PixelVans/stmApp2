const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require('../../config/db'); 

router.get("/:weeknumber", async (req, res) => {
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

module.exports = router;
