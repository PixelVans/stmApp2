
const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require('../../config/db'); 

router.get("/:dyestuff", async (req, res) => {
  const { dyestuff } = req.params;
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .input("dyestuff", dyestuff)
      .query("SELECT * FROM [Specialised Systems].dbo.Dyestuffs WHERE Description = @dyestuff");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "dyestuff not found" });
    }

    res.json(result.recordset[0]); 
  } catch (err) {
   // console.error(err);
    res.status(500).send("Error fetching dyeing row");
  }
});

module.exports = router;
