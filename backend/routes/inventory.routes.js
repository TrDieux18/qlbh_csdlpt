const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../config/database");

// Get all inventory items
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    console.log("🔍 [INVENTORY] Fetching all inventory items...");
    const result = await pool.request().query(`
            SELECT i.*, 
                   b.branch_name,
                   p.product_name,
                   p.unit
            FROM INVENTORY i
            INNER JOIN BRANCH b ON i.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS = b.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS
            INNER JOIN PRODUCT p ON i.product_id COLLATE SQL_Latin1_General_CP1_CI_AS = p.product_id COLLATE SQL_Latin1_General_CP1_CI_AS
            ORDER BY i.branch_id, i.product_id
        `);
    console.log(
      `✅ [INVENTORY] Found ${result.recordset.length} inventory items`
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ [INVENTORY] Error fetching inventory:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get inventory by ID
router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🔍 [INVENTORY] Fetching inventory with ID: ${req.params.id}`);
    const result = await pool.request().input("id", sql.Char(20), req.params.id)
      .query(`
                SELECT i.*, 
                       b.branch_name,
                       p.product_name,
                       p.unit
                FROM INVENTORY i
                INNER JOIN BRANCH b ON i.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS = b.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS
                INNER JOIN PRODUCT p ON i.product_id COLLATE SQL_Latin1_General_CP1_CI_AS = p.product_id COLLATE SQL_Latin1_General_CP1_CI_AS
                WHERE i.inventory_id = @id
            `);
    console.log(`✅ [INVENTORY] Found:`, result.recordset[0] ? "Yes" : "No");
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ [INVENTORY] Error fetching inventory:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get inventory by branch
router.get("/branch/:branchId", async (req, res) => {
  try {
    const pool = getPool();
    console.log(
      `🔍 [INVENTORY] Fetching inventory for branch: ${req.params.branchId}`
    );
    const result = await pool
      .request()
      .input("branchId", sql.Char(20), req.params.branchId).query(`
                SELECT i.*, 
                       p.product_name,
                       p.unit,
                       p.price
                FROM INVENTORY i
                INNER JOIN PRODUCT p ON i.product_id COLLATE SQL_Latin1_General_CP1_CI_AS = p.product_id COLLATE SQL_Latin1_General_CP1_CI_AS
                WHERE i.branch_id = @branchId
                ORDER BY p.product_name
            `);
    console.log(
      `✅ [INVENTORY] Found ${result.recordset.length} items for branch`
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ [INVENTORY] Error fetching by branch:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create inventory item
router.post("/", async (req, res) => {
  try {
    const pool = getPool();
    const {
      inventory_id,
      branch_id,
      product_id,
      stock_quantity,
      last_restock_date,
      notes,
    } = req.body;

    console.log(`➕ [INVENTORY] Creating inventory:`, {
      inventory_id,
      branch_id,
      product_id,
      stock_quantity,
    });
    await pool
      .request()
      .input("inventory_id", sql.Char(20), inventory_id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("product_id", sql.Char(20), product_id)
      .input("stock_quantity", sql.Int, stock_quantity || 0)
      .input("last_restock_date", sql.Date, last_restock_date)
      .input("notes", sql.NVarChar(200), notes).query(`
                INSERT INTO INVENTORY (inventory_id, branch_id, product_id, stock_quantity, last_restock_date, notes)
                VALUES (@inventory_id, @branch_id, @product_id, @stock_quantity, @last_restock_date, @notes)
            `);

    console.log(`✅ [INVENTORY] Inventory item created successfully`);
    res.json({ message: "Inventory item created successfully" });
  } catch (err) {
    console.error("❌ [INVENTORY] Error creating inventory:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update inventory
router.put("/:id", async (req, res) => {
  try {
    const pool = getPool();
    const { branch_id, product_id, stock_quantity, last_restock_date, notes } =
      req.body;

    console.log(`✏️ [INVENTORY] Updating inventory ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("inventory_id", sql.Char(20), req.params.id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("product_id", sql.Char(20), product_id)
      .input("stock_quantity", sql.Int, stock_quantity)
      .input("last_restock_date", sql.Date, last_restock_date)
      .input("notes", sql.NVarChar(200), notes).query(`
                UPDATE INVENTORY SET 
                    branch_id = @branch_id,
                    product_id = @product_id,
                    stock_quantity = @stock_quantity,
                    last_restock_date = @last_restock_date,
                    notes = @notes
                WHERE inventory_id = @inventory_id
            `);

    console.log(`✅ [INVENTORY] Updated ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Inventory updated successfully" });
  } catch (err) {
    console.error("❌ [INVENTORY] Error updating inventory:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete inventory item
router.delete("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🗑️ [INVENTORY] Deleting inventory ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("inventory_id", sql.Char(20), req.params.id)
      .query("DELETE FROM INVENTORY WHERE inventory_id = @inventory_id");

    console.log(`✅ [INVENTORY] Deleted ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    console.error("❌ [INVENTORY] Error deleting inventory:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
