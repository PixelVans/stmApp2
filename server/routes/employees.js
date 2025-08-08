const express = require('express');
const router = express.Router();
const { connectToDB, sql } = require('../config/db'); 

// GET all employees
router.get('/', async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query(`
      SELECT 
        e.EmployeeID,
        e.FirstName,
        e.LastName,
        e.Email,
        e.Phone,
        e.HireDate,
        e.Position,
        e.DepartmentID,
        d.Name AS DepartmentName
      FROM Employees e
      LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Server Error');
  }
});

// POST a new employee
router.post('/', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    hireDate,
    departmentId,
    position,
  } = req.body;

  if (!firstName || !lastName || !email || !hireDate || !departmentId || !position) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectToDB();
    await pool.request()
      .input('FirstName', sql.NVarChar, firstName)
      .input('LastName', sql.NVarChar, lastName)
      .input('Email', sql.NVarChar, email)
      .input('Phone', sql.NVarChar, phone)
      .input('HireDate', sql.Date, hireDate)
      .input('DepartmentID', sql.Int, departmentId)
      .input('Position', sql.NVarChar, position)
      .query(`
        INSERT INTO Employees 
          (FirstName, LastName, Email, Phone, HireDate, DepartmentID, Position)
        VALUES 
          (@FirstName, @LastName, @Email, @Phone, @HireDate, @DepartmentID, @Position)
      `);

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
