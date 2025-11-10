import express from "express";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router();

// POST /auth/google — verifies Google token and issues JWT
router.post("/google", googleAuth);

export default router;
