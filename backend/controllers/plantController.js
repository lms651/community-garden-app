import Plant from "../models/plant.js";
import logger from "../logger.js";

// Get all plants
export const getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find(); // returns all plants
        res.status(200).json(plants);
    } catch (error) {
        logger.error("Error fetching plants:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single plant by ID
export const getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: "Plant not found" });
        res.status(200).json(plant);
    } catch (error) {
        logger.error("Error fetching plant:", error);
        res.status(500).json({ message: error.message });
    }
};
