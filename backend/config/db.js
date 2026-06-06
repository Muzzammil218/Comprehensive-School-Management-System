// backend/config/db.js
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL Database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle database client", err);
  process.exit(-1);
});

// ✅ THIS IS THE IMPORTANT CHANGE: Use ES Module export instead of module.exports
export default pool;