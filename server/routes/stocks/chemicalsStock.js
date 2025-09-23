const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

// Get all chemicals
router.get("/", async (req, res) => {
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .query("SELECT * FROM [Specialised Systems].dbo.Chemicals");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching chemicals:", err);
    res.status(500).send("Error fetching chemicals data");
  }
});


// Add new chemical
router.post("/", async (req, res) => {
  const {
    Description,
    ChemicalsIndex,
    QuantityonHand,
    UnitofMeasure,
    CostperKgLt,
    SupplierName,
    SupplierItemCode,
    SellingUnits,
    UnitCost,
    UnitCostgm,
    VATCostKg,
    VATCostgm,
    VATUnitCost,
  } = req.body;

  try {
    const pool = await connectToDB2();

    await pool.request()
      .input("Description", sql.VarChar(255), Description)
      .input("ChemicalsIndex", sql.Int, ChemicalsIndex)
      .input("QuantityonHand", sql.Float, QuantityonHand)
      .input("UnitofMeasure", sql.VarChar(50), UnitofMeasure)
      .input("CostperKgLt", sql.Float, CostperKgLt)
      .input("SupplierName", sql.VarChar(255), SupplierName)
      .input("SupplierItemCode", sql.VarChar(255), SupplierItemCode)
      .input("SellingUnits", sql.Float, SellingUnits)
      .input("UnitCost", sql.Float, UnitCost)
      .input("UnitCostgm", sql.Float, UnitCostgm)
      .input("VATCostKg", sql.Float, VATCostKg)
      .input("VATCostgm", sql.Float, VATCostgm)
      .input("VATUnitCost", sql.Float, VATUnitCost)
      .query(`
        INSERT INTO [Specialised Systems].dbo.Chemicals
        (Description, ChemicalsIndex, QuantityonHand, UnitofMeasure,
         CostperKgLt, SupplierName, SupplierItemCode, SellingUnits,
         UnitCost, UnitCostgm, VATCostKg, VATCostgm, VATUnitCost)
        VALUES (@Description, @ChemicalsIndex, @QuantityonHand, @UnitofMeasure,
                @CostperKgLt, @SupplierName, @SupplierItemCode, @SellingUnits,
                @UnitCost, @UnitCostgm, @VATCostKg, @VATCostgm, @VATUnitCost)
      `);

    res.json({ message: "Chemical added successfully" });
  } catch (err) {
    console.error("Error adding chemical:", err);
    res.status(500).send("Error adding chemical");
  }
});


// Bulk update chemicals
router.put("/bulk-update", async (req, res) => {
  const rows = req.body; // array of chemicals with IDs

  console.log('the rows received are:', rows)
  try {
    const pool = await connectToDB2();

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    for (const row of rows) {
      const id = Number(row.ID);
      const qty = Number(row.QuantityonHand);

      // Skip rows with invalid ID or quantity
      if (!id || isNaN(qty)) {
        console.warn("Skipping row with invalid ID or Quantity:", row);
        continue;
      }

      await new sql.Request(transaction)
        .input("ID", sql.Int, id)
        .input("QuantityonHand", sql.Float, qty)
        .query(`
          UPDATE [Specialised Systems].dbo.Chemicals
          SET QuantityonHand = @QuantityonHand
          WHERE ID = @ID
        `);
    }

    await transaction.commit();
    res.json({ message: "Bulk update successful" });
  } catch (err) {
    console.error("Bulk update error:", err);
    res.status(500).send("Error during bulk update");
  }
});


// Update chemical (full update of any field)
router.put("/:id", async (req, res) => {
  const {
    Description,
    ChemicalsIndex,
    QuantityonHand,
    UnitofMeasure,
    CostperKgLt,
    SupplierName,
    SupplierItemCode,
    SellingUnits,
    UnitCost,
    UnitCostgm,
    VATCostKg,
    VATCostgm,
    VATUnitCost,
  } = req.body;

  try {
    const pool = await connectToDB2();

    await pool.request()
      .input("ID", sql.Int, req.params.id)
      .input("Description", sql.VarChar(255), Description)
      .input("ChemicalsIndex", sql.Int, ChemicalsIndex)
      .input("QuantityonHand", sql.Float, QuantityonHand)
      .input("UnitofMeasure", sql.VarChar(50), UnitofMeasure)
      .input("CostperKgLt", sql.Float, CostperKgLt)
      .input("SupplierName", sql.VarChar(255), SupplierName)
      .input("SupplierItemCode", sql.VarChar(255), SupplierItemCode)
      .input("SellingUnits", sql.Float, SellingUnits)
      .input("UnitCost", sql.Float, UnitCost)
      .input("UnitCostgm", sql.Float, UnitCostgm)
      .input("VATCostKg", sql.Float, VATCostKg)
      .input("VATCostgm", sql.Float, VATCostgm)
      .input("VATUnitCost", sql.Float, VATUnitCost)
      .query(`
        UPDATE [Specialised Systems].dbo.Chemicals
        SET Description = @Description,
            ChemicalsIndex = @ChemicalsIndex,
            QuantityonHand = @QuantityonHand,
            UnitofMeasure = @UnitofMeasure,
            CostperKgLt = @CostperKgLt,
            SupplierName = @SupplierName,
            SupplierItemCode = @SupplierItemCode,
            SellingUnits = @SellingUnits,
            UnitCost = @UnitCost,
            UnitCostgm = @UnitCostgm,
            VATCostKg = @VATCostKg,
            VATCostgm = @VATCostgm,
            VATUnitCost = @VATUnitCost
        WHERE ID = @ID
      `);

    res.json({ message: "Chemical updated successfully" });
  } catch (err) {
    console.error("Error updating chemical:", err);
    res.status(500).send("Error updating chemical");
  }
});






// Delete chemical
router.delete("/:id", async (req, res) => {
  try {
    const pool = await connectToDB2();

    await pool.request()
      .input("ID", sql.Int, req.params.id)
      .query("DELETE FROM [Specialised Systems].dbo.Chemicals WHERE ID = @ID");

    res.json({ message: "Chemical deleted successfully" });
  } catch (err) {
    console.error("Error deleting chemical:", err);
    res.status(500).send("Error deleting chemical");
  }
});

module.exports = router;
