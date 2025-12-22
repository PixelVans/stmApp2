
const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require('../../config/db'); 

router.get("/:colour", async (req, res) => {
  const { colour } = req.params;
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .input("colour", colour)
      .query("SELECT * FROM Ingredients_Dyeing WHERE Colour_Chart = @colour");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Colour not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    //console.error(err);
    res.status(500).send("Error fetching dyeing row");
  }
});

module.exports = router;
