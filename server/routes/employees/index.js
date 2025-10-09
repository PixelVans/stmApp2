const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

// GET all employees
router.get("/", async (req, res) => {
  try {
    const pool = await connectToDB2();
    const result = await pool
      .request()
      .query("SELECT ID, EmployerID, FirstName, LastName FROM [Specialised Systems].dbo.Employees ORDER BY ID");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send("Error fetching employees data");
  }
});

module.exports = router;
