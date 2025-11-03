import express from "express";
import { createTrade, getUserTrades, updateTradeStatus, cancelTrade } from "../controllers/tradeController.js";

const router = express.Router();

// Route: /trades
router.post("/", createTrade);
router.get("/user/:userId", getUserTrades);
router.put("/:tradeId/status", updateTradeStatus);
router.delete("/:tradeId", cancelTrade);

export default router;