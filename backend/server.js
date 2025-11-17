const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const routes = require("./routes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log request
  console.log("\n" + "=".repeat(60));
  console.log(`📨 ${req.method} ${req.path}`);
  console.log(`⏰ Time: ${new Date().toLocaleString("vi-VN")}`);

  if (req.method === "POST" || req.method === "PUT") {
    console.log(`📦 Request Body:`, JSON.stringify(req.body, null, 2));
  }

  if (req.params && Object.keys(req.params).length > 0) {
    console.log(`🔑 Params:`, req.params);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`❓ Query:`, req.query);
  }

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`⏱️  Duration: ${duration}ms`);

    // Try to parse and log response
    try {
      const jsonData = JSON.parse(data);
      if (Array.isArray(jsonData)) {
        console.log(`📊 Response: Array with ${jsonData.length} items`);
        if (jsonData.length > 0 && jsonData.length <= 3) {
          console.log(JSON.stringify(jsonData, null, 2));
        }
      } else {
        console.log(`📊 Response:`, JSON.stringify(jsonData, null, 2));
      }
    } catch (e) {
      console.log(`📊 Response: ${data.substring(0, 200)}`);
    }

    console.log("=".repeat(60) + "\n");

    originalSend.call(this, data);
  };

  next();
});

// API Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    message: "QLBH API Server",
    status: "running",
    endpoints: {
      branches: "/api/branches",
      employees: "/api/employees",
      customers: "/api/customers",
      products: "/api/products",
    },
  });
});

app.listen(PORT, async () => {
  console.log(`\n========================================`);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`========================================\n`);

  await connectDB();
});
