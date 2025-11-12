// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./logger.js";

import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/plants", plantRoutes);
app.use("/trades", tradeRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Community Garden backend running!");
});

// Connect DB (optional: move to server.js if you prefer to connect only once)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => logger.info("✅ MongoDB connected"))
    .catch((err) => logger.error(err));
}

export default app;
