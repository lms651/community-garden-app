import express from "express";
import { createUser, getMapUsers, getUserProfile, getUserGarden, updateUser, deleteUser, getMapUsers, addPlantToGarden, updatTradeStatus, removePlantFromGarden } from "../controllers/userController.js";

const router = express.Router();

// /users
router.post("/", createUser);
router.get("/", getMapUsers);
router.get("/:id", getUserProfile);
router.get("/:id", getUserGarden);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Nested garden routes
// /users/:userId/garden
router.post("/:userId/garden", addPlantToGarden); // Add plant
router.put("/:userId/garden/:plantId", updateTradeStatus); // Toggle forTrade
router.delete("/:userId/garden/:plantId", removePlantFromGarden); // Remove plant

export default router;