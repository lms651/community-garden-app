import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './logger.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ROUTES
app.use("/auth", authRoutes);

app.use("/users", userRoutes);
app.use("/plants", plantRoutes);
app.use("/trades", tradeRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Community Garden backend running!');
});

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error(err));

// app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

// Connect DB only if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error(err));

  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

export default app;