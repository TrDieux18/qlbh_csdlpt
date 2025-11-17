const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../config/database");

// Get all customers
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    console.log("🔍 [CUSTOMER] Fetching all customers...");
    const result = await pool.request().query("SELECT * FROM CUSTOMER");
    console.log(`✅ [CUSTOMER] Found ${result.recordset.length} customers`);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ [CUSTOMER] Error fetching customers:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get customer by ID
router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🔍 [CUSTOMER] Fetching customer with ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("id", sql.Char(20), req.params.id)
      .query("SELECT * FROM CUSTOMER WHERE customer_id = @id");
    console.log(`✅ [CUSTOMER] Found:`, result.recordset[0] ? "Yes" : "No");
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ [CUSTOMER] Error fetching customer:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create customer
router.post("/", async (req, res) => {
  try {
    const pool = getPool();
    const {
      customer_id,
      branch_id,
      full_name,
      phone_number,
      email,
      address,
      registration_date,
      customer_type,
      reward_points,
    } = req.body;
    console.log(`➕ [CUSTOMER] Creating customer:`, {
      customer_id,
      full_name,
      customer_type,
    });
    await pool
      .request()
      .input("customer_id", sql.Char(20), customer_id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("full_name", sql.NVarChar(100), full_name)
      .input("phone_number", sql.VarChar(20), phone_number)
      .input("email", sql.VarChar(100), email)
      .input("address", sql.NVarChar(255), address)
      .input("registration_date", sql.Date, registration_date)
      .input("customer_type", sql.NVarChar(30), customer_type)
      .input("reward_points", sql.Int, reward_points)
      .query(`INSERT INTO CUSTOMER (customer_id, branch_id, full_name, phone_number, email, address, registration_date, customer_type, reward_points)
                    VALUES (@customer_id, @branch_id, @full_name, @phone_number, @email, @address, @registration_date, @customer_type, @reward_points)`);
    console.log(`✅ [CUSTOMER] Customer created successfully`);
    res.json({ message: "Customer created successfully" });
  } catch (err) {
    console.error("❌ [CUSTOMER] Error creating customer:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update customer
router.put("/:id", async (req, res) => {
  try {
    const pool = getPool();
    const {
      branch_id,
      full_name,
      phone_number,
      email,
      address,
      registration_date,
      customer_type,
      reward_points,
    } = req.body;
    console.log(`✏️ [CUSTOMER] Updating customer ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("customer_id", sql.Char(20), req.params.id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("full_name", sql.NVarChar(100), full_name)
      .input("phone_number", sql.VarChar(20), phone_number)
      .input("email", sql.VarChar(100), email)
      .input("address", sql.NVarChar(255), address)
      .input("registration_date", sql.Date, registration_date)
      .input("customer_type", sql.NVarChar(30), customer_type)
      .input("reward_points", sql.Int, reward_points)
      .query(`UPDATE CUSTOMER SET branch_id = @branch_id, full_name = @full_name, phone_number = @phone_number,
                    email = @email, address = @address, registration_date = @registration_date,
                    customer_type = @customer_type, reward_points = @reward_points
                    WHERE customer_id = @customer_id`);
    console.log(`✅ [CUSTOMER] Updated ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("❌ [CUSTOMER] Error updating customer:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🗑️ [CUSTOMER] Deleting customer ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("customer_id", sql.Char(20), req.params.id)
      .query("DELETE FROM CUSTOMER WHERE customer_id = @customer_id");
    console.log(`✅ [CUSTOMER] Deleted ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("❌ [CUSTOMER] Error deleting customer:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
