const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

// GET Grey Rolls by date
router.get("/by-date/:date", async (req, res) => {
  const { date } = req.params;

  try {
    const pool = await connectToDB2();

    const result = await pool
      .request()
      .input("date", sql.Date, date)
      .query(`
        SELECT *
        FROM [Specialised Systems].dbo.GreyRolls
        WHERE [Date] = @date
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No Grey Rolls found for this date" });
    }

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Grey Rolls by date");
  }
});



// GET Grey Roll by Roll Number
router.get("/by-roll/:rollno", async (req, res) => {
  const { rollno } = req.params;

  try {
    const pool = await connectToDB2();

    const result = await pool.request()
      .input("RollNo", sql.Int, rollno)
      .query(`
        SELECT *
        FROM [Specialised Systems].dbo.GreyRolls
        WHERE RollNo = @RollNo
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Roll number not found" });
    }

    res.json(result.recordset[0]); 

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Grey Roll by roll number");
  }
});


// POST insert/update Grey Roll data based only on RollNo
router.post("/update-grey-data", async (req, res) => {
  const {
    RollNo,
    Date,
    MachineNo,
    Article,
    Length,
    Weight,
    Weaver,
    Shift,
    Grade,
    Remarks,
  } = req.body;

  const normalize = (val, type = "string") => {
    if (val === undefined || val === null || val === "") return null;
    if (type === "int") {
      const parsed = parseInt(val, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    if (type === "float") {
      const parsed = parseFloat(val);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return val;
  };

  try {
    // Required fields check
    if (!RollNo) {
      return res.status(400).json({ message: "RollNo is required" });
    }

    const pool = await connectToDB2();

    // Check if RollNo already exists
    const existing = await pool.request()
      .input("RollNo", sql.Int, normalize(RollNo, "int"))
      .query(`
        SELECT ID 
        FROM [Specialised Systems].dbo.GreyRolls
        WHERE RollNo = @RollNo
      `);

    if (existing.recordset.length > 0) {
      // UPDATE existing row
      await pool.request()
        .input("RollNo", sql.Int, normalize(RollNo, "int"))
        .input("Date", sql.Date, Date)
        .input("MachineNo", sql.Int, normalize(MachineNo, "int"))
        .input("Article", sql.NVarChar(100), normalize(Article))
        .input("Length", sql.Decimal(10, 4), normalize(Length, "float"))
        .input("Weight", sql.Decimal(10, 4), normalize(Weight, "float"))
        .input("Weaver", sql.NVarChar(100), normalize(Weaver))
        .input("Shift", sql.Char(1), normalize(Shift))
        .input("Grade", sql.Char(1), normalize(Grade))
        .input("Remarks", sql.NVarChar(200), normalize(Remarks))
        .input("ID", sql.Int, existing.recordset[0].ID)
        .query(`
          UPDATE [Specialised Systems].dbo.GreyRolls
          SET 
            [Date] = @Date,
            MachineNo = @MachineNo,
            Article = @Article,
            Length = @Length,
            Weight = @Weight,
            Weaver = @Weaver,
            Shift = @Shift,
            Grade = @Grade,
            Remarks = @Remarks
          WHERE ID = @ID
        `);

      return res.json({ message: "Grey Roll updated successfully" });
    }

    // INSERT new row
    await pool.request()
      .input("RollNo", sql.Int, normalize(RollNo, "int"))
      .input("Date", sql.Date, Date)
      .input("MachineNo", sql.Int, normalize(MachineNo, "int"))
      .input("Article", sql.NVarChar(100), normalize(Article))
      .input("Length", sql.Decimal(10, 4), normalize(Length, "float"))
      .input("Weight", sql.Decimal(10, 4), normalize(Weight, "float"))
      .input("Weaver", sql.NVarChar(100), normalize(Weaver))
      .input("Shift", sql.Char(1), normalize(Shift))
      .input("Grade", sql.Char(1), normalize(Grade))
      .input("Remarks", sql.NVarChar(200), normalize(Remarks))
      .query(`
        INSERT INTO [Specialised Systems].dbo.GreyRolls
        (RollNo, [Date], MachineNo, Article, Length, Weight, Weaver, Shift, Grade, Remarks)
        VALUES
        (@RollNo, @Date, @MachineNo, @Article, @Length, @Weight, @Weaver, @Shift, @Grade, @Remarks)
      `);

    res.json({ message: "Grey Roll inserted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving Grey Roll data");
  }
});

module.exports = router;
