const express = require("express");
const router = express.Router();
const multer = require("multer");
const BranchInfo = require("../models/BranchInfo");
const { deleteFile } = require("../utils/fileUtils");

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
  console.log("Add branch req.body:", req.body);
  console.log("Add branch req.file:", req.file);
  const { location, fbLink, instaLink, youtubeLink, emails, phoneNumbers, isMain } = req.body;

  // Validation functions
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;

  // Validate emails
  const emailList = Array.isArray(emails) ? emails : emails ? [emails] : [];
  for (const email of emailList) {
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: `Invalid email format: ${email}` });
    }
  }

  // Validate phone numbers
  const phoneList = Array.isArray(phoneNumbers) ? phoneNumbers : phoneNumbers ? [phoneNumbers] : [];
  for (const phone of phoneList) {
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: `Invalid phone number format: ${phone}` });
    }
  }

  try {
    const branchData = {
      location,
      image: req.file ? req.file.path : "",
      fbLink: fbLink || "",
      instaLink: instaLink || "",
      youtubeLink: youtubeLink || "",
      emails: emailList,
      phoneNumbers: phoneList,
      isMain: isMain === "true" || isMain === true,
      featured: false,
    };
    const branch = await BranchInfo.findOneAndUpdate(
      {},
      { $push: { branches: branchData } },
      { new: true, upsert: true }
    );
    res.json({ message: "New branch added successfully", branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a branch
router.put("/edit/:branchId", upload.single("image"), async (req, res) => {
  console.log("Edit branch req.body:", req.body);
  console.log("Edit branch req.file:", req.file);
  const { location, fbLink, instaLink, youtubeLink, emails, phoneNumbers, isMain } = req.body;
  const { branchId } = req.params;

  // Validation functions
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;

  // Validate emails
  const emailList = Array.isArray(emails) ? emails : emails ? [emails] : [];
  for (const email of emailList) {
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: `Invalid email format: ${email}` });
    }
  }

  // Validate phone numbers
  const phoneList = Array.isArray(phoneNumbers) ? phoneNumbers : phoneNumbers ? [phoneNumbers] : [];
  for (const phone of phoneList) {
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: `Invalid phone number format: ${phone}` });
    }
  }

  try {
    const branchInfo = await BranchInfo.findOne({ "branches._id": branchId });
    if (!branchInfo) {
      return res.status(404).json({ error: "Branch not found" });
    }
    const branchToEdit = branchInfo.branches.id(branchId);
    if (!branchToEdit) {
      return res.status(404).json({ error: "Branch not found" });
    }

    const updateData = {
      "branches.$.location": location,
      "branches.$.fbLink": fbLink || "",
      "branches.$.instaLink": instaLink || "",
      "branches.$.youtubeLink": youtubeLink || "",
      "branches.$.emails": emailList,
      "branches.$.phoneNumbers": phoneList,
      "branches.$.isMain": isMain === "true" || isMain === true,
    };

    if (req.file) {
      // Delete old image file
      if (branchToEdit.image) {
        deleteFile(branchToEdit.image);
      }
      updateData["branches.$.image"] = req.file.path;
    }

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
    const branchInfo = await BranchInfo.findOne({ "branches._id": branchId });
    if (!branchInfo) {
      return res.status(404).json({ error: "Branch not found" });
    }
    const branchToDelete = branchInfo.branches.id(branchId);
    if (!branchToDelete) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Delete image file
    if (branchToDelete.image) {
      deleteFile(branchToDelete.image);
    }

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
