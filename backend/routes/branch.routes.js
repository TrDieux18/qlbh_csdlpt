const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../config/database");

// Get all branches
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    console.log("🔍 [BRANCH] Fetching all branches...");
    const result = await pool.request().query("SELECT * FROM BRANCH");
    console.log(`✅ [BRANCH] Found ${result.recordset.length} branches`);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ [BRANCH] Error fetching branches:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get branch by ID
router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🔍 [BRANCH] Fetching branch with ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("id", sql.Char(20), req.params.id)
      .query("SELECT * FROM BRANCH WHERE branch_id = @id");
    console.log(`✅ [BRANCH] Found:`, result.recordset[0] ? "Yes" : "No");
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ [BRANCH] Error fetching branch:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create branch
router.post("/", async (req, res) => {
  try {
    const pool = getPool();
    const {
      branch_id,
      branch_name,
      address,
      phone_number,
      email,
      founded_date,
      branch_type,
      status,
    } = req.body;
    console.log(`➕ [BRANCH] Creating branch:`, { branch_id, branch_name });
    await pool
      .request()
      .input("branch_id", sql.Char(20), branch_id)
      .input("branch_name", sql.NVarChar(100), branch_name)
      .input("address", sql.NVarChar(255), address)
      .input("phone_number", sql.VarChar(20), phone_number)
      .input("email", sql.VarChar(100), email)
      .input("founded_date", sql.Date, founded_date)
      .input("branch_type", sql.NVarChar(30), branch_type)
      .input("status", sql.Bit, status)
      .query(`INSERT INTO BRANCH (branch_id, branch_name, address, phone_number, email, founded_date, branch_type, status)
                    VALUES (@branch_id, @branch_name, @address, @phone_number, @email, @founded_date, @branch_type, @status)`);
    console.log(`✅ [BRANCH] Branch created successfully`);
    res.json({ message: "Branch created successfully" });
  } catch (err) {
    console.error("❌ [BRANCH] Error creating branch:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update branch
router.put("/:id", async (req, res) => {
  try {
    const pool = getPool();
    const {
      branch_name,
      address,
      phone_number,
      email,
      founded_date,
      branch_type,
      status,
    } = req.body;
    console.log(`✏️ [BRANCH] Updating branch ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("branch_id", sql.Char(20), req.params.id)
      .input("branch_name", sql.NVarChar(100), branch_name)
      .input("address", sql.NVarChar(255), address)
      .input("phone_number", sql.VarChar(20), phone_number)
      .input("email", sql.VarChar(100), email)
      .input("founded_date", sql.Date, founded_date)
      .input("branch_type", sql.NVarChar(30), branch_type)
      .input("status", sql.Bit, status)
      .query(`UPDATE BRANCH SET branch_name = @branch_name, address = @address, phone_number = @phone_number,
                    email = @email, founded_date = @founded_date, branch_type = @branch_type, status = @status
                    WHERE branch_id = @branch_id`);
    console.log(`✅ [BRANCH] Updated ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Branch updated successfully" });
  } catch (err) {
    console.error("❌ [BRANCH] Error updating branch:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete branch
router.delete("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🗑️ [BRANCH] Deleting branch ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("branch_id", sql.Char(20), req.params.id)
      .query("DELETE FROM BRANCH WHERE branch_id = @branch_id");
    console.log(`✅ [BRANCH] Deleted ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Branch deleted successfully" });
  } catch (err) {
    console.error("❌ [BRANCH] Error deleting branch:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
