import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => {
  return res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

const port = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
});
