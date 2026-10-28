const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// MySQL Connection Pool
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "srv1881.hstgr.io",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "u774474676_dd_leads",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "u774474676_dd_leads",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
    });
  }
  return pool;
}

// Auto-initialize MySQL Table
async function initDatabase() {
  try {
    const db = getPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS resort_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        whatsapp_number VARCHAR(30) NOT NULL,
        property_location VARCHAR(255) NOT NULL,
        service_needed VARCHAR(255) NOT NULL,
        budget_range VARCHAR(100) NOT NULL,
        status ENUM('new', 'contacted', 'converted', 'closed') DEFAULT 'new',
        ip_address VARCHAR(45) NULL,
        user_agent VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createTableQuery);
    console.log("✅ MySQL Table 'resort_leads' verified/ready.");
  } catch (error) {
    console.error("⚠️ Database connection note:", error.message);
    console.log(
      "👉 Tip: Ensure your password is set in .env and 'Remote MySQL' is enabled in Hostinger hPanel."
    );
  }
}

// Health check endpoint (Render uses this)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Digital Diaries Lead API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// POST endpoint: Store Resort Lead
app.post("/api/resort-leads", async (req, res) => {
  try {
    const {
      propertyName,
      contactName,
      whatsappNumber,
      propertyLocation,
      serviceNeeded,
      budgetRange,
    } = req.body;

    // Validation
    if (
      !propertyName ||
      !contactName ||
      !whatsappNumber ||
      !propertyLocation ||
      !serviceNeeded ||
      !budgetRange
    ) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be filled.",
      });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    const userAgent = (req.headers["user-agent"] || "").slice(0, 255);

    const db = getPool();
    const insertQuery = `
      INSERT INTO resort_leads 
        (property_name, contact_name, whatsapp_number, property_location, service_needed, budget_range, ip_address, user_agent) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(insertQuery, [
      propertyName.trim(),
      contactName.trim(),
      whatsappNumber.trim(),
      propertyLocation.trim(),
      serviceNeeded,
      budgetRange,
      ip,
      userAgent,
    ]);

    console.log(`🎉 New Resort Lead captured for '${propertyName.trim()}' (ID: ${result.insertId})`);

    return res.status(201).json({
      success: true,
      message: "Lead captured successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error storing lead:", error);
    return res.status(500).json({
      success: false,
      error: `Database error: ${error.message || "Failed to store lead."}`,
    });
  }
});

// GET endpoint: Fetch recent leads (for admin review)
app.get("/api/resort-leads", async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      "SELECT id, property_name, contact_name, whatsapp_number, property_location, service_needed, budget_range, created_at FROM resort_leads ORDER BY id DESC LIMIT 50"
    );
    res.json({ success: true, count: rows.length, leads: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Node.js Lead Server running on port ${PORT}`);
  initDatabase();
});
