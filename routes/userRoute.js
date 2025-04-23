const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming auth middleware exists

// Multer config for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set in auth middleware
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update current user profile
router.put("/profile", authMiddleware, upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "profileBackgroundPicture", maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
    };
    if (req.files.profilePicture) {
      updateData.profilePicture = req.files.profilePicture[0].path;
    }
    if (req.files.profileBackgroundPicture) {
      updateData.profileBackgroundPicture = req.files.profileBackgroundPicture[0].path;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
