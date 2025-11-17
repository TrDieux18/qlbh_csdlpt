const express = require("express");
const router = express.Router();

const branchRoutes = require("./branch.routes");
const employeeRoutes = require("./employee.routes");
const customerRoutes = require("./customer.routes");
const productRoutes = require("./product.routes");
const inventoryRoutes = require("./inventory.routes");
const invoiceRoutes = require("./invoice.routes");

// Register all routes
router.use("/branches", branchRoutes);
router.use("/employees", employeeRoutes);
router.use("/customers", customerRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/invoices", invoiceRoutes);

module.exports = router;
