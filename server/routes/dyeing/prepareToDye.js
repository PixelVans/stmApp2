const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require('../../config/db'); 

router.get("/:colour", async (req, res) => {
  const { colour } = req.params;

  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .input("colour", sql.VarChar, colour)
      .query(`
        SELECT p.*, d.Dyestuff_1_Amt, d.Dyestuff_2_Amt, d.Dyestuff_3_Amt
        FROM Ingredients_Prepare_To_Dye p
        LEFT JOIN Ingredients_Dyeing d
          ON p.Colour_Chart = d.Colour_Chart
        WHERE p.Colour_Chart = @colour
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Colour not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
   // console.error(err);
    res.status(500).send("Error fetching colour row");
  }
});


module.exports = router;
