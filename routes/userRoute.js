
const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming auth middleware exists

// Simple admin check middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

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

// Admin: Get all users
router.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update user by ID
router.put("/admin/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      isBlocked: req.body.isBlocked,
      isAdmin: req.body.isAdmin,  // Added support for isAdmin update
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete user by ID
router.delete("/admin/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Block or unblock user by ID
router.put("/admin/users/:id/block", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { block } = req.body; // boolean: true to block, false to unblock
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked: block }, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
