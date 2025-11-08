import Trade from "../models/trade.js";
import logger from '../logger.js'; 

export const createTrade = async (req, res) => {
  try {
    const { initiator, recipient, initiatorPlants, recipientPlants } = req.body;

    // Check for existing active trade between these users
    const existingTrade = await Trade.findOne({
      dateDeleted: null,
      status: { $in: ["pending", "accepted"] },
      $or: [
        { initiator, recipient },
        { initiator: recipient, recipient: initiator },
      ],
    });

    if (existingTrade) {
      return res
        .status(400)
        .json({ message: "A trade already exists between these users." });
    }

    const trade = await Trade.create({
      initiator,
      recipient,
      initiatorPlants,
      recipientPlants,
    });

    res.status(201).json(trade);
  } catch (error) {
    console.error("Error creating trade:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get all trades for a specific user (status doesn't matter)
export const getUserTrades = async (req, res) => {
    try {
        const { userId } = req.params;

        const trades = await Trade.find({
            $and: [
            { dateDeleted: null },
            { $or: [{ initiaor: userId }, { recipient: userId }] }
            ]
        })
            .populate("initiator", "userName")
            .populate("recipient", "userName")
            .populate("initiatorPlants", "plantName imageSrc")
            .populate("recipientPlants", "plantName imageSrc");

        res.status(200).json(trades);
    } catch (error) {
        logger.error("Error fetching trades:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update trade status (accept/complete)
export const updateTradeStatus = async (req, res) => {
    try {
        const { tradeId } = req.params;
        const { status } = req.body;

        const trade = await Trade.findByIdAndUpdate(
            tradeId,
            { status },
            { new: true }
        );

        if (!trade) return res.status(404).json({ message: "Trade not found" });

        res.status(200).json(trade);
    } catch (error) {
        logger.error("Error updating trade status:", error);
        res.status(500).json({ message: error.message });
    }
};

// Soft delete (cancel trade)
export const cancelTrade = async (req, res) => {
    try {
        const { tradeId } = req.params;

        const trade = await Trade.findByIdAndUpdate(
            tradeId,
            { dateDeleted: new Date(), status: "canceled" },
            { new: true }
        );

        if (!trade) return res.status(404).json({ message: "Trade not found" });
        res.status(200).json({ message: "Trade canceled", trade });
    } catch (error) {
        logger.error("Error canceling trade:", error);
        res.status(500).json({ message: error.message });
  }
};
