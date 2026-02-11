import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const port = process.env.PORT || 3000;
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || "apppass",
  database: process.env.DB_NAME || "appdb",
});

app.use(cors());
app.use(express.json());

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS logins (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/message", (req, res) => {
  res.json({
    title: "Backend Calculator",
    message: "POST /api/calculate with numbers and an operation.",
  });
});

app.post("/api/calculate", (req, res) => {
  const { a, b, op } = req.body || {};
  const numA = Number(a);
  const numB = Number(b);

  if (!Number.isFinite(numA) || !Number.isFinite(numB)) {
    return res.status(400).json({ error: "Both numbers are required." });
  }

  let result = 0;
  let symbol = "+";

  switch (op) {
    case "add":
      result = numA + numB;
      symbol = "+";
      break;
    case "sub":
      result = numA - numB;
      symbol = "-";
      break;
    case "mul":
      result = numA * numB;
      symbol = "*";
      break;
    case "div":
      if (numB === 0) {
        return res.status(400).json({ error: "Division by zero is not allowed." });
      }
      result = numA / numB;
      symbol = "/";
      break;
    default:
      return res.status(400).json({ error: "Unknown operation." });
  }

  return res.json({
    result,
    expression: `${numA} ${symbol} ${numB}`,
  });
});

app.get("/api/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Database unavailable." });
  }
});

app.post("/api/login-log", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    await pool.query("INSERT INTO logins (email) VALUES ($1)", [email]);
    return res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ error: "Unable to write to database." });
  }
});

app.get("/api/login-log", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 5), 20);
    const result = await pool.query(
      "SELECT email, created_at FROM logins ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    return res.json({ status: "ok", items: result.rows });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Unable to read from database." });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

initDb().catch((error) => {
  console.error("Database init failed:", error.message);
});
