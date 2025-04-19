const express = require("express");
const router = express.Router();
const multer = require("multer");
const BranchInfo = require("../models/BranchInfo");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Get Branch Details
router.get("/", async (req, res) => {
  try {
    const branch = await BranchInfo.findOne();
    res.json({ message: "Branch details fetched successfully", branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update findus-title and findus-description
router.put("/title-description", async (req, res) => {
  const { title, description } = req.body;
  try {
    const branch = await BranchInfo.findOneAndUpdate(
      {},
      { title, description },
      { new: true, upsert: true }
    );
    res.json({ message: "Title and description updated successfully", branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new branch
router.post("/add", upload.single("image"), async (req, res) => {
  const { location } = req.body;
  try {
    const branch = await BranchInfo.findOneAndUpdate(
      {},
      { $push: { branches: { location, image: req.file.path } } },
      { new: true, upsert: true }
    );
    res.json({ message: "New branch added successfully", branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a branch
router.put("/edit/:branchId", upload.single("image"), async (req, res) => {
  const { location } = req.body;
  const { branchId } = req.params;
  try {
    const updateData = { "branches.$.location": location };
    if (req.file) updateData["branches.$.image"] = req.file.path;

    const branch = await BranchInfo.findOneAndUpdate(
      { "branches._id": branchId },
      { $set: updateData },
      { new: true }
    );
    res.json({ message: "Branch updated successfully", branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a branch
router.delete("/delete/:branchId", async (req, res) => {
  const { branchId } = req.params;
  try {
    const branch = await BranchInfo.findOneAndUpdate(
      {},
      { $pull: { branches: { _id: branchId } } },
      { new: true }
    );
    res.json({ message: "Branch deleted successfully", branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle featured status
router.put("/toggle-featured/:branchId", async (req, res) => {
  const { branchId } = req.params;

  try {
    const branch = await BranchInfo.findOne();
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Count current featured branches
    const currentFeaturedCount = branch.branches.filter((b) => b.featured).length;

    // Find the branch to toggle
    const branchToUpdate = branch.branches.id(branchId);

    if (!branchToUpdate) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Allow toggle only if within the limit
    if (!branchToUpdate.featured && currentFeaturedCount >= 8) {
      return res.status(400).json({ error: "Only 8 branches can be featured at a time" });
    }

    branchToUpdate.featured = !branchToUpdate.featured;
    await branch.save();

    res.json({ message: "Featured status updated successfully", branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
