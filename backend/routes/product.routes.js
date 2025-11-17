const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../config/database");

// Get all products
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    console.log("🔍 [PRODUCT] Fetching all products...");
    const result = await pool.request().query("SELECT * FROM PRODUCT");
    console.log(`✅ [PRODUCT] Found ${result.recordset.length} products`);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ [PRODUCT] Error fetching products:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🔍 [PRODUCT] Fetching product with ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("id", sql.Char(20), req.params.id)
      .query("SELECT * FROM PRODUCT WHERE product_id = @id");
    console.log(`✅ [PRODUCT] Found:`, result.recordset[0] ? "Yes" : "No");
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ [PRODUCT] Error fetching product:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create product
router.post("/", async (req, res) => {
  try {
    const pool = getPool();
    const {
      product_id,
      product_name,
      category,
      unit,
      price,
      description,
      status,
    } = req.body;
    console.log(`➕ [PRODUCT] Creating product:`, {
      product_id,
      product_name,
      category,
      price,
    });
    await pool
      .request()
      .input("product_id", sql.Char(20), product_id)
      .input("product_name", sql.NVarChar(150), product_name)
      .input("category", sql.NVarChar(50), category)
      .input("unit", sql.NVarChar(20), unit)
      .input("price", sql.Decimal(15, 2), price)
      .input("description", sql.NVarChar(500), description)
      .input("status", sql.Bit, status)
      .query(`INSERT INTO PRODUCT (product_id, product_name, category, unit, price, description, status)
                    VALUES (@product_id, @product_name, @category, @unit, @price, @description, @status)`);
    console.log(`✅ [PRODUCT] Product created successfully`);
    res.json({ message: "Product created successfully" });
  } catch (err) {
    console.error("❌ [PRODUCT] Error creating product:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const pool = getPool();
    const { product_name, category, unit, price, description, status } =
      req.body;
    console.log(`✏️ [PRODUCT] Updating product ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("product_id", sql.Char(20), req.params.id)
      .input("product_name", sql.NVarChar(150), product_name)
      .input("category", sql.NVarChar(50), category)
      .input("unit", sql.NVarChar(20), unit)
      .input("price", sql.Decimal(15, 2), price)
      .input("description", sql.NVarChar(500), description)
      .input("status", sql.Bit, status)
      .query(`UPDATE PRODUCT SET product_name = @product_name, category = @category, unit = @unit,
                    price = @price, description = @description, status = @status
                    WHERE product_id = @product_id`);
    console.log(`✅ [PRODUCT] Updated ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("❌ [PRODUCT] Error updating product:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🗑️ [PRODUCT] Deleting product ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("product_id", sql.Char(20), req.params.id)
      .query("DELETE FROM PRODUCT WHERE product_id = @product_id");
    console.log(`✅ [PRODUCT] Deleted ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ [PRODUCT] Error deleting product:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
