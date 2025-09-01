
const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require('../../config/db'); 

router.get("/:chemical", async (req, res) => {
  const { chemical } = req.params;
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .input("chemical", chemical)
      .query("SELECT * FROM [Specialised Systems].dbo.Chemicals WHERE Description = @chemical");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Chemical not found" });
    }

    res.json(result.recordset[0]); // send the full row (object)
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching dyeing row");
  }
});

module.exports = router;
