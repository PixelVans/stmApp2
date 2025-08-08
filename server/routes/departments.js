// routes/departments.js (or inline if needed)
const express = require('express');
const router = express.Router();
const { connectToDB, sql } = require('../config/db'); 


// GET departments
router.get('/', async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query('SELECT DepartmentID, Name FROM Departments');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
