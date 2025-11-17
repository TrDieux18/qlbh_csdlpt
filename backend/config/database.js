const sql = require("mssql");

// Cấu hình kết nối database
// Server name: TRANDIEU\CSDLPTNHOM06 (từ SSMS)
const config = {
  user: "sa",
  password: "123456",
  server: "localhost\\CSDLPTNHOM06",
  database: "QLBH_CNAG",
  driver: "msnodesqlv8",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

let pool;

async function connectDB() {
  try {
    console.log("Connecting to SQL Server...");
    console.log(`Server: ${config.server}`);
    console.log(`Database: ${config.database}`);

    pool = await sql.connect(config);

    console.log("✓ Connected to SQL Server successfully");
    console.log(`✓ Database: ${config.database}\n`);
    return pool;
  } catch (err) {
    console.error("\n✗ Database connection failed!");
    console.error("Error:", err.message);
    
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database not connected. Please check config/database.js");
  }
  return pool;
}

module.exports = {
  connectDB,
  getPool,
  sql,
};
