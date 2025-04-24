const express = require("express");
const multer = require("multer");
const path = require("path");
const About = require("../models/About");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get About Us content
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About Us content not found" });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update About Us content with image uploads (admin only)
router.put("/", adminMiddleware, upload.any(), async (req, res) => {
  try {
    console.log("PUT /api/about req.body:", req.body);
    console.log("PUT /api/about req.files:", req.files);

    let about = await About.findOne();
    const body = req.body;

    // Initialize updatedData as empty object
    const updatedData = {};

    // Update whoWeAre if present
    if (body.whoWeAreTitle || body.whoWeAreContent || req.files.some(f => f.fieldname === "whoWeAreImage")) {
      updatedData.whoWeAre = {
        title: body.whoWeAreTitle || (about ? about.whoWeAre.title : ""),
        content: body.whoWeAreContent || (about ? about.whoWeAre.content : ""),
        image: about ? about.whoWeAre.image : ""
      };
      const whoWeAreImageFile = req.files.find(f => f.fieldname === "whoWeAreImage");
      if (whoWeAreImageFile) {
        updatedData.whoWeAre.image = "/uploads/" + whoWeAreImageFile.filename;
      }
    }

    // Update whatWeDo if present
    if (body.whatWeDoTitle || body.whatWeDoContent || req.files.some(f => f.fieldname === "whatWeDoImage")) {
      updatedData.whatWeDo = {
        title: body.whatWeDoTitle || (about ? about.whatWeDo.title : ""),
        content: body.whatWeDoContent || (about ? about.whatWeDo.content : ""),
        image: about ? about.whatWeDo.image : ""
      };
      const whatWeDoImageFile = req.files.find(f => f.fieldname === "whatWeDoImage");
      if (whatWeDoImageFile) {
        updatedData.whatWeDo.image = "/uploads/" + whatWeDoImageFile.filename;
      }
    }

    // Update whyChooseUs if present
    if (body.whyChooseUsTitle || body.whyChooseUsContent || req.files.some(f => f.fieldname === "whyChooseUsImage") || body.testimonials) {
      updatedData.whyChooseUs = {
        title: body.whyChooseUsTitle || (about ? about.whyChooseUs.title : ""),
        content: body.whyChooseUsContent || (about ? about.whyChooseUs.content : ""),
        image: about ? about.whyChooseUs.image : "",
        testimonials: body.testimonials ? JSON.parse(body.testimonials) : (about ? about.whyChooseUs.testimonials : [])
      };
      const whyChooseUsImageFile = req.files.find(f => f.fieldname === "whyChooseUsImage");
      if (whyChooseUsImageFile) {
        updatedData.whyChooseUs.image = "/uploads/" + whyChooseUsImageFile.filename;
      }
    }

    // Update meetTheTeam if present
    if (body.meetTheTeamTitle || body.meetTheTeamContent || req.files.some(f => f.fieldname.startsWith("meetTheTeamImage"))) {
      // Parse meetTheTeam entries from body
      const meetTheTeamTitles = Array.isArray(body.meetTheTeamTitle) ? body.meetTheTeamTitle : [body.meetTheTeamTitle];
      const meetTheTeamContents = Array.isArray(body.meetTheTeamContent) ? body.meetTheTeamContent : [body.meetTheTeamContent];

      // Map uploaded files for meetTheTeam images by fieldname with index
      const meetTheTeamImagesMap = {};
      req.files.forEach(file => {
        if (file.fieldname.startsWith("meetTheTeamImage")) {
          const index = parseInt(file.fieldname.replace("meetTheTeamImage", ""), 10);
          meetTheTeamImagesMap[index] = "/uploads/" + file.filename;
        }
      });

      const meetTheTeamArray = meetTheTeamTitles.map((title, idx) => ({
        title: title || "Meet the Team / Our Culture",
        content: meetTheTeamContents[idx] || "",
        image: meetTheTeamImagesMap[idx] || (about && about.meetTheTeam[idx] ? about.meetTheTeam[idx].image : "")
      }));

      updatedData.meetTheTeam = meetTheTeamArray;
    }

    if (!about) {
      about = new About(updatedData);
    } else {
      about.set(updatedData);
    }
    await about.save();
    res.json(about);
  } catch (error) {
    console.error("Error in PUT /api/about:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
