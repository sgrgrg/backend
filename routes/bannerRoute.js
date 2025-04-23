const express = require("express");
const router = express.Router();
const multer = require("multer");
const Banner = require("../models/Banner");
const storage = require("../config/multerStorage");

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
    const bannerData = {
      title,
      description,
      facebook,
      instagram,
      youtube,
    };
    if (req.file) {
      bannerData.image = req.file.path; // Save the image path
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

module.exports = router;
