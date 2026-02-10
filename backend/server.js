import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
