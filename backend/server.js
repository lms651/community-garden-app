import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './logger.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Community Garden backend running!');
});

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));