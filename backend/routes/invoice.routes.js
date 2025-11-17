const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../config/database");

// Get all invoices
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    console.log("🔍 [INVOICE] Fetching all invoices...");
    const result = await pool.request().query(`
            SELECT i.*, 
                   b.branch_name,
                   c.full_name as customer_name,
                   e.full_name as employee_name
            FROM INVOICE i
            LEFT JOIN BRANCH b ON i.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS = b.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS
            LEFT JOIN CUSTOMER c ON i.customer_id COLLATE SQL_Latin1_General_CP1_CI_AS = c.customer_id COLLATE SQL_Latin1_General_CP1_CI_AS
            LEFT JOIN EMPLOYEE e ON i.employee_id COLLATE SQL_Latin1_General_CP1_CI_AS = e.employee_id COLLATE SQL_Latin1_General_CP1_CI_AS
            ORDER BY i.invoice_date DESC
        `);
    console.log(`✅ [INVOICE] Found ${result.recordset.length} invoices`);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ [INVOICE] Error fetching invoices:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get invoice by ID with details
router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    console.log(`🔍 [INVOICE] Fetching invoice with ID: ${req.params.id}`);

    // Get invoice header
    const invoice = await pool
      .request()
      .input("id", sql.Char(20), req.params.id).query(`
                SELECT i.*, 
                       b.branch_name,
                       c.full_name as customer_name,
                       e.full_name as employee_name
                FROM INVOICE i
                LEFT JOIN BRANCH b ON i.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS = b.branch_id COLLATE SQL_Latin1_General_CP1_CI_AS
                LEFT JOIN CUSTOMER c ON i.customer_id COLLATE SQL_Latin1_General_CP1_CI_AS = c.customer_id COLLATE SQL_Latin1_General_CP1_CI_AS
                LEFT JOIN EMPLOYEE e ON i.employee_id COLLATE SQL_Latin1_General_CP1_CI_AS = e.employee_id COLLATE SQL_Latin1_General_CP1_CI_AS
                WHERE i.invoice_id = @id
            `);

    // Get invoice details
    const details = await pool
      .request()
      .input("id", sql.Char(20), req.params.id).query(`
                SELECT d.*, p.product_name, p.unit
                FROM INVOICE_DETAIL d
                INNER JOIN PRODUCT p ON d.product_id COLLATE SQL_Latin1_General_CP1_CI_AS = p.product_id COLLATE SQL_Latin1_General_CP1_CI_AS
                WHERE d.invoice_id = @id
            `);

    console.log(
      `✅ [INVOICE] Found invoice: ${
        invoice.recordset.length > 0 ? "Yes" : "No"
      }`
    );
    console.log(`✅ [INVOICE] Details count: ${details.recordset.length}`);

    if (invoice.recordset.length > 0) {
      const result = {
        ...invoice.recordset[0],
        details: details.recordset,
      };
      res.json(result);
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
  } catch (err) {
    console.error("❌ [INVOICE] Error fetching invoice:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create invoice with details
router.post("/", async (req, res) => {
  const pool = getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const {
      invoice_id,
      branch_id,
      customer_id,
      employee_id,
      invoice_date,
      discount,
      payment_method,
      status,
      details,
    } = req.body;

    console.log(`➕ [INVOICE] Creating invoice:`, {
      invoice_id,
      branch_id,
      details_count: details?.length || 0,
    });

    // Calculate total
    let total_amount = 0;
    if (details && details.length > 0) {
      total_amount = details.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
    }
    const final_amount = total_amount - (discount || 0);

    console.log(
      `💰 [INVOICE] Amounts: total=${total_amount}, discount=${
        discount || 0
      }, final=${final_amount}`
    );

    // Insert invoice header
    await transaction
      .request()
      .input("invoice_id", sql.Char(20), invoice_id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("customer_id", sql.Char(20), customer_id || null)
      .input("employee_id", sql.Char(20), employee_id)
      .input("invoice_date", sql.DateTime, invoice_date || new Date())
      .input("total_amount", sql.Decimal(15, 2), total_amount)
      .input("discount", sql.Decimal(15, 2), discount || 0)
      .input("final_amount", sql.Decimal(15, 2), final_amount)
      .input("payment_method", sql.NVarChar(30), payment_method)
      .input("status", sql.NVarChar(20), status || "Completed").query(`
                INSERT INTO INVOICE (invoice_id, branch_id, customer_id, employee_id, invoice_date, 
                                     total_amount, discount, final_amount, payment_method, status)
                VALUES (@invoice_id, @branch_id, @customer_id, @employee_id, @invoice_date,
                        @total_amount, @discount, @final_amount, @payment_method, @status)
            `);

    // Insert invoice details
    if (details && details.length > 0) {
      for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        await transaction
          .request()
          .input("detail_id", sql.Char(20), detail.detail_id)
          .input("invoice_id", sql.Char(20), invoice_id)
          .input("product_id", sql.Char(20), detail.product_id)
          .input("quantity", sql.Int, detail.quantity)
          .input("unit_price", sql.Decimal(15, 2), detail.unit_price).query(`
                        INSERT INTO INVOICE_DETAIL (detail_id, invoice_id, product_id, quantity, unit_price)
                        VALUES (@detail_id, @invoice_id, @product_id, @quantity, @unit_price)
                    `);
      }
      console.log(`✅ [INVOICE] Inserted ${details.length} detail items`);
    }

    await transaction.commit();
    console.log(`✅ [INVOICE] Invoice created successfully`);
    res.json({ message: "Invoice created successfully", invoice_id });
  } catch (err) {
    await transaction.rollback();
    console.error("❌ [INVOICE] Error creating invoice:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update invoice with details
router.put("/:id", async (req, res) => {
  const pool = getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const {
      branch_id,
      customer_id,
      employee_id,
      invoice_date,
      total_amount,
      discount,
      final_amount,
      payment_method,
      status,
      details,
    } = req.body;

    console.log(`✏️ [INVOICE] Updating invoice ID: ${req.params.id}`);
    console.log(`📦 [INVOICE] Details count: ${details?.length || 0}`);

    // Update invoice header
    const result = await transaction
      .request()
      .input("invoice_id", sql.Char(20), req.params.id)
      .input("branch_id", sql.Char(20), branch_id)
      .input("customer_id", sql.Char(20), customer_id)
      .input("employee_id", sql.Char(20), employee_id)
      .input("invoice_date", sql.DateTime, invoice_date)
      .input("total_amount", sql.Decimal(15, 2), total_amount)
      .input("discount", sql.Decimal(15, 2), discount)
      .input("final_amount", sql.Decimal(15, 2), final_amount)
      .input("payment_method", sql.NVarChar(30), payment_method)
      .input("status", sql.NVarChar(20), status).query(`
                UPDATE INVOICE SET 
                    branch_id = @branch_id,
                    customer_id = @customer_id,
                    employee_id = @employee_id,
                    invoice_date = @invoice_date,
                    total_amount = @total_amount,
                    discount = @discount,
                    final_amount = @final_amount,
                    payment_method = @payment_method,
                    status = @status
                WHERE invoice_id = @invoice_id
            `);

    console.log(
      `✅ [INVOICE] Updated invoice ${result.rowsAffected[0]} row(s)`
    );

    // If details are provided, update them
    if (details && details.length > 0) {
      // Delete old details
      const deleteResult = await transaction
        .request()
        .input("invoice_id", sql.Char(20), req.params.id)
        .query("DELETE FROM INVOICE_DETAIL WHERE invoice_id = @invoice_id");

      console.log(
        `🗑️ [INVOICE] Deleted ${deleteResult.rowsAffected[0]} old detail(s)`
      );

      // Insert new details
      for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        await transaction
          .request()
          .input("detail_id", sql.Char(20), detail.detail_id)
          .input("invoice_id", sql.Char(20), req.params.id)
          .input("product_id", sql.Char(20), detail.product_id)
          .input("quantity", sql.Int, detail.quantity)
          .input("unit_price", sql.Decimal(15, 2), detail.unit_price).query(`
                        INSERT INTO INVOICE_DETAIL (detail_id, invoice_id, product_id, quantity, unit_price)
                        VALUES (@detail_id, @invoice_id, @product_id, @quantity, @unit_price)
                    `);
      }
      console.log(`✅ [INVOICE] Inserted ${details.length} new detail(s)`);
    }

    await transaction.commit();
    res.json({ message: "Invoice updated successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error("❌ [INVOICE] Error updating invoice:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete invoice (will cascade delete details if configured)
router.delete("/:id", async (req, res) => {
  const pool = getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();
    console.log(`🗑️ [INVOICE] Deleting invoice ID: ${req.params.id}`);

    // Delete details first
    const detailsResult = await transaction
      .request()
      .input("invoice_id", sql.Char(20), req.params.id)
      .query("DELETE FROM INVOICE_DETAIL WHERE invoice_id = @invoice_id");

    console.log(
      `✅ [INVOICE] Deleted ${detailsResult.rowsAffected[0]} detail row(s)`
    );

    // Delete invoice
    const invoiceResult = await transaction
      .request()
      .input("invoice_id", sql.Char(20), req.params.id)
      .query("DELETE FROM INVOICE WHERE invoice_id = @invoice_id");

    console.log(
      `✅ [INVOICE] Deleted ${invoiceResult.rowsAffected[0]} invoice row(s)`
    );

    await transaction.commit();
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error("❌ [INVOICE] Error deleting invoice:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
