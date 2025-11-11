const express = require("express");
const router = express.Router();
const { connectToDB2, sql } = require("../../config/db");

// ==================== GET ALL WARPING STOCK ====================
router.get("/", async (req, res) => {
  try {
    const pool = await connectToDB2();
    const result = await pool.request()
      .query("SELECT * FROM [Specialised Systems].dbo.WarpingStock");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching WarpingStock:", err);
    res.status(500).send("Error fetching WarpingStock data");
  }
});

// ==================== ADD NEW WARPING STOCK ITEM ====================
router.post("/", async (req, res) => {
  const { StockIndex, Description, Type, QuantityOnHand, UnitOfMeasure } = req.body;

  try {
    const pool = await connectToDB2();

    let stockIndexToUse = StockIndex;

    // Auto-generate StockIndex if missing or invalid
    if (!stockIndexToUse || isNaN(stockIndexToUse)) {
      const result = await pool.request().query(`
        SELECT ISNULL(MAX(StockIndex), 0) + 1 AS NextIndex 
        FROM [Specialised Systems].dbo.WarpingStock
      `);
      stockIndexToUse = result.recordset[0].NextIndex;
    }

    await pool.request()
      .input("StockIndex", sql.Int, stockIndexToUse)
      .input("Description", sql.NVarChar(100), Description)
      .input("Type", sql.NVarChar(50), Type || null)
      .input("QuantityOnHand", sql.Int, QuantityOnHand)
      .input("UnitOfMeasure", sql.NVarChar(20), UnitOfMeasure)
      .query(`
        INSERT INTO [Specialised Systems].dbo.WarpingStock
        (StockIndex, Description, Type, QuantityOnHand, UnitOfMeasure)
        VALUES (@StockIndex, @Description, @Type, @QuantityOnHand, @UnitOfMeasure)
      `);

    res.json({ 
      message: "Warping stock item added successfully", 
      StockIndex: stockIndexToUse 
    });
  } catch (err) {
    console.error("Error adding WarpingStock item:", err);
    res.status(500).send("Error adding WarpingStock item");
  }
});

// ==================== BULK UPDATE WARPING STOCK ====================
router.put("/bulk-update", async (req, res) => {
  const rows = req.body;

  try {
    const pool = await connectToDB2();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    for (const row of rows) {
      const id = Number(row.ID);
      const qty = Number(row.QuantityOnHand);

      if (!id || isNaN(qty)) {
        console.warn("Skipping invalid WarpingStock row:", row);
        continue;
      }

      await new sql.Request(transaction)
        .input("ID", sql.Int, id)
        .input("QuantityOnHand", sql.Int, qty)
        .query(`
          UPDATE [Specialised Systems].dbo.WarpingStock
          SET QuantityOnHand = @QuantityOnHand
          WHERE ID = @ID
        `);
    }

    await transaction.commit();
    res.json({ message: "WarpingStock bulk update successful" });
  } catch (err) {
    console.error("Bulk update error for WarpingStock:", err);
    res.status(500).send("Error during WarpingStock bulk update");
  }
});

// ==================== UPDATE SINGLE WARPING STOCK ITEM ====================
router.put("/:id", async (req, res) => {
  const { StockIndex, Description, Type, QuantityOnHand, UnitOfMeasure } = req.body;

  try {
    const pool = await connectToDB2();

    await pool.request()
      .input("ID", sql.Int, req.params.id)
      .input("StockIndex", sql.Int, StockIndex)
      .input("Description", sql.NVarChar(100), Description)
      .input("Type", sql.NVarChar(50), Type || null)
      .input("QuantityOnHand", sql.Int, QuantityOnHand)
      .input("UnitOfMeasure", sql.NVarChar(20), UnitOfMeasure)
      .query(`
        UPDATE [Specialised Systems].dbo.WarpingStock
        SET StockIndex = @StockIndex,
            Description = @Description,
            Type = @Type,
            QuantityOnHand = @QuantityOnHand,
            UnitOfMeasure = @UnitOfMeasure
        WHERE ID = @ID
      `);

    res.json({ message: "WarpingStock item updated successfully" });
  } catch (err) {
    console.error("Error updating WarpingStock item:", err);
    res.status(500).send("Error updating WarpingStock item");
  }
});

// ==================== DELETE WARPING STOCK ITEM ====================
router.delete("/:id", async (req, res) => {
  try {
    const pool = await connectToDB2();

    await pool.request()
      .input("ID", sql.Int, req.params.id)
      .query("DELETE FROM [Specialised Systems].dbo.WarpingStock WHERE ID = @ID");

    res.json({ message: "WarpingStock item deleted successfully" });
  } catch (err) {
    console.error("Error deleting WarpingStock item:", err);
    res.status(500).send("Error deleting WarpingStock item");
  }
});

module.exports = router;
