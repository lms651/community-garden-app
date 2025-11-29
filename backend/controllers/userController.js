import User from "../models/user.js";
import logger from '../logger.js'; 

// Create new user
export const createUser = async (req, res) => {
    try {
        const { userName, email, address } = req.body;

        if (!address) {
          return res.status(400).json({ message: "Address is required" });
        }

        const user = new User({ userName, email, address });
        await user.save();
        res.status(201).json(user);
        
    } catch (error) {
        logger.error("Error creating user:", error);
        res.status(400).json({ message: error.message });
    }
};

// Get user info for header/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      dateDeleted: null
    })
    .select("userName displayName image email address");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user profile:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get all users to populate map
export const getMapUsers = async (req, res) => {
  try {
    const users = await User.find({ dateDeleted: null })
      .select("displayName userName address garden.forTrade");

    const formattedUsers = users.map(user => {
      const hasTradePlants = user.garden.some(item => item.forTrade === true);

      return {
        id: user._id,
        // Prefer displayName; fall back to userName if they haven't set one yet
        name: user.displayName || user.userName,
        address: user.address,
        hasTradePlants
      };
    });

    res.status(200).json(formattedUsers);
  } catch (error) {
    logger.error("Error fetching map users:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user garden
// export const getUserGarden = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       _id: req.params.id,
//       dateDeleted: null
//     }).populate("garden.plantId");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(user);
//   } catch (error) {
//     logger.error("Error fetching user:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getUserGarden = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("garden.plantId"); // populate name and image

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user garden:", error);
    res.status(500).json({ message: error.message });
  }
};


// Update user profile
// add image as req.body later!!!
export const updateUser = async (req, res) => {
  try {
    const { displayName, email, address } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, dateDeleted: null },
      { displayName, email, address },
      { new: true, runValidators: true } // new: true means return updated doc. run validators makes sure you follow schema.
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: error.message });
  }
};

// Soft delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, dateDeleted: null },
      { dateDeleted: new Date() },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User soft-deleted", user });
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};

// NESTED GARDEN ROUTES

// Add plant to garden
export const addPlantToGarden = async (req, res) => {
  try {
    const { userId } = req.params;
    const { plantId } = req.body;

    const user = await User.findById(userId);
    if (!user || user.dateDeleted) return res.status(404).json({ message: "User not found" });

    // Check for duplicates
    const alreadyInGarden = user.garden.some(item => item.plantId.toString() === plantId);
    if (alreadyInGarden) return res.status(400).json({ message: "Plant already in garden" });

    // Add plant and save update
    user.garden.push({ plantId });
    await user.save();

    res.status(200).json(user);
  } catch (error) {
      logger.error("Error adding plant to garden:", error);
      res.status(500).json({ message: error.message });
  }
};

// Remove a plant from user garden
export const removePlantFromGarden = async (req, res) => {
  try {
    const { userId, plantId } = req.params;

    const user = await User.findById(userId);
    if (!user || user.dateDeleted) return res.status(404).json({ message: "User not found" });

    // save garden by filtering out plant
    user.garden = user.garden.filter(item => item.plantId.toString() !== plantId);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error removing plant from garden:", error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle forTrade status for plant in user garden
export const flagForTrade = async (req, res) => {
  try {
    const { userId, plantId } = req.params;
    const { forTrade } = req.body; // true or false

    const user = await User.findOneAndUpdate(
      { _id: userId, "garden.plantId": plantId },
      { $set: { "garden.$.forTrade": forTrade } }, // updates the matched array element
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User or plant not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating garden plant trade status:", error);
    res.status(500).json({ message: error.message });
  }
};
