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
    title: "Simple Full-Stack Starter",
    message: "Frontend served by Nginx. Backend powered by Express.",
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
