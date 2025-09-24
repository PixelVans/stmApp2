const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

// Get all Dyestuffs

router.get("/", async (req, res) => {
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .query("SELECT * FROM [Specialised Systems].dbo.Dyestuffs");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching Dyestuffs:", err);
    res.status(500).send("Error fetching Dyestuffs data");
  }
});


// Add new Dyestuff
router.post("/", async (req, res) => {
  const {
    Description,
    DyestuffsIndex,
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
      .input("DyestuffsIndex", sql.Int, DyestuffsIndex)
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
        INSERT INTO [Specialised Systems].dbo.Dyestuffs
        (Description, DyestuffsIndex, QuantityonHand, UnitofMeasure,
         CostperKgLt, SupplierName, SupplierItemCode, SellingUnits,
         UnitCost, UnitCostgm, VATCostKg, VATCostgm, VATUnitCost)
        VALUES (@Description, @DyestuffsIndex, @QuantityonHand, @UnitofMeasure,
                @CostperKgLt, @SupplierName, @SupplierItemCode, @SellingUnits,
                @UnitCost, @UnitCostgm, @VATCostKg, @VATCostgm, @VATUnitCost)
      `);

    res.json({ message: "Dyestuff added successfully" });
  } catch (err) {
    console.error("Error adding Dyestuff:", err);
    res.status(500).send("Error adding Dyestuff");
  }
});


// Bulk update Dyestuffs
router.put("/bulk-update", async (req, res) => {
  const rows = req.body; // array of Dyestuffs with IDs

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
          UPDATE [Specialised Systems].dbo.Dyestuffs
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


// Update Dyestuffs (full update of any field)
router.put("/:id", async (req, res) => {
  const {
    Description,
    DyestuffsIndex,
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
      .input("DyestuffsIndex", sql.Int, DyestuffsIndex)
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
        UPDATE [Specialised Systems].dbo.Dyestuffs
        SET Description = @Description,
            DyestuffsIndex = @DyestuffsIndex,
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

    res.json({ message: "Dyestuffs updated successfully" });
  } catch (err) {
    console.error("Error updating Dyestuff:", err);
    res.status(500).send("Error updating Dyestuff");
  }
});






// Delete Dyestuff
router.delete("/:id", async (req, res) => {
  try {
    const pool = await connectToDB2();

    await pool.request()
      .input("ID", sql.Int, req.params.id)
      .query("DELETE FROM [Specialised Systems].dbo.Dyestuffs WHERE ID = @ID");

    res.json({ message: "Dyestuff deleted successfully" });
  } catch (err) {
    console.error("Error deleting Dyestuff:", err);
    res.status(500).send("Error deleting Dyestuff");
  }
});

module.exports = router;
