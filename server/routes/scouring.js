// routes/scouring.js
const express = require("express");
const router = express.Router();
const { connectToDB, sql } = require('../config/db'); 

router.get("/:colour", async (req, res) => {
  const { colour } = req.params;
  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input("colour", colour)
      .query("SELECT * FROM Ingredients_Scouring WHERE Colour_Chart = @colour");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Colour not found" });
    }

    res.json(result.recordset[0]); // send the full row (object)
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching scouring row");
  }
});

module.exports = router;
