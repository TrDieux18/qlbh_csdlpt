const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../config/database");

// Get all employees
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    console.log("🔍 [EMPLOYEE] Fetching all employees...");
    const result = await pool.request().query("SELECT * FROM EMPLOYEE");
    console.log(`✅ [EMPLOYEE] Found ${result.recordset.length} employees`);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ [EMPLOYEE] Error fetching employees:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get employee by ID
router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🔍 [EMPLOYEE] Fetching employee with ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("id", sql.Char(20), req.params.id)
      .query("SELECT * FROM EMPLOYEE WHERE employee_id = @id");
    console.log(`✅ [EMPLOYEE] Found:`, result.recordset[0] ? "Yes" : "No");
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ [EMPLOYEE] Error fetching employee:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create employee
router.post("/", async (req, res) => {
  try {
    const pool = getPool();
    const {
      employee_id,
      branch_id,
      full_name,
      birth_date,
      gender,
      phone_number,
      email,
      position,
      hire_date,
      salary,
      status,
    } = req.body;
    console.log(`➕ [EMPLOYEE] Creating employee:`, {
      employee_id,
      full_name,
      position,
    });
    await pool
      .request()
      .input("employee_id", sql.Char(20), employee_id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("full_name", sql.NVarChar(100), full_name)
      .input("birth_date", sql.Date, birth_date)
      .input("gender", sql.NVarChar(10), gender)
      .input("phone_number", sql.VarChar(20), phone_number)
      .input("email", sql.VarChar(100), email)
      .input("position", sql.NVarChar(50), position)
      .input("hire_date", sql.Date, hire_date)
      .input("salary", sql.Decimal(15, 2), salary)
      .input("status", sql.Bit, status)
      .query(`INSERT INTO EMPLOYEE (employee_id, branch_id, full_name, birth_date, gender, phone_number, email, position, hire_date, salary, status)
                    VALUES (@employee_id, @branch_id, @full_name, @birth_date, @gender, @phone_number, @email, @position, @hire_date, @salary, @status)`);
    console.log(`✅ [EMPLOYEE] Employee created successfully`);
    res.json({ message: "Employee created successfully" });
  } catch (err) {
    console.error("❌ [EMPLOYEE] Error creating employee:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  try {
    const pool = getPool();
    const {
      branch_id,
      full_name,
      birth_date,
      gender,
      phone_number,
      email,
      position,
      hire_date,
      salary,
      status,
    } = req.body;
    console.log(`✏️ [EMPLOYEE] Updating employee ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("employee_id", sql.Char(20), req.params.id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("full_name", sql.NVarChar(100), full_name)
      .input("birth_date", sql.Date, birth_date)
      .input("gender", sql.NVarChar(10), gender)
      .input("phone_number", sql.VarChar(20), phone_number)
      .input("email", sql.VarChar(100), email)
      .input("position", sql.NVarChar(50), position)
      .input("hire_date", sql.Date, hire_date)
      .input("salary", sql.Decimal(15, 2), salary)
      .input("status", sql.Bit, status)
      .query(`UPDATE EMPLOYEE SET branch_id = @branch_id, full_name = @full_name, birth_date = @birth_date,
                    gender = @gender, phone_number = @phone_number, email = @email, position = @position,
                    hire_date = @hire_date, salary = @salary, status = @status
                    WHERE employee_id = @employee_id`);
    console.log(`✅ [EMPLOYEE] Updated ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    console.error("❌ [EMPLOYEE] Error updating employee:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🗑️ [EMPLOYEE] Deleting employee ID: ${req.params.id}`);
    const result = await pool
      .request()
      .input("employee_id", sql.Char(20), req.params.id)
      .query("DELETE FROM EMPLOYEE WHERE employee_id = @employee_id");
    console.log(`✅ [EMPLOYEE] Deleted ${result.rowsAffected[0]} row(s)`);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("❌ [EMPLOYEE] Error deleting employee:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
