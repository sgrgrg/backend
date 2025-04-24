const express = require("express");
const router = express.Router();
const multer = require("multer");
const Banner = require("../models/Banner");
const { deleteFile } = require("../utils/fileUtils");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get Banner
router.get("/", async (req, res) => {
  try {
    const banner = await Banner.findOne();
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Banner with Image
router.put("/:id", upload.single("image"), async (req, res) => {
  const { title, description, facebook, instagram, youtube } = req.body;
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    const bannerData = {
      title,
      description,
      facebook,
      instagram,
      youtube,
    };

    if (req.file) {
      // Delete old image file
      if (banner.image) {
        deleteFile(banner.image);
      }
      bannerData.image = req.file.path; // Save the new image path
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      bannerData,
      { new: true }
    );
    res.json(updatedBanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Banner and its image
router.delete("/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Delete image file
    if (banner.image) {
      deleteFile(banner.image);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
