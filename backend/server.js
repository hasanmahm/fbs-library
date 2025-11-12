import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import bookRoutes from "./routes/bookRoutes.js";
import borrowerRoutes from "./routes/borrowerRoutes.js";
import "./utils/scheduler.js"; // auto start cron job

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/books", bookRoutes);
app.use("/api/borrowers", borrowerRoutes);

// Simple admin login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ ok: true, message: "আসসালামু আলাইকুম। স্বাগতম।" });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

// Serve frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
