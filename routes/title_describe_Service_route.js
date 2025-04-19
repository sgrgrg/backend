// routes/title_describe_Service_route.js
const express = require("express");
const TitleDescribeService = require("../models/title_describe_Service");
const router = express.Router();

// GET all title and description details
router.get("/", async (req, res) => {
  try {
    const titleDescribeServices = await TitleDescribeService.find();
    res.json(titleDescribeServices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching title and description." });
  }
});

// POST update title and description details
router.post("/", async (req, res) => {
  const { title, description } = req.body;

  try {
    const existingService = await TitleDescribeService.find();
    if (existingService.length > 0) {
      // If a record already exists, update it
      existingService[0].title = title;
      existingService[0].description = description;
      await existingService[0].save();
    } else {
      // If no record exists, create a new one
      const newService = new TitleDescribeService({ title, description });
      await newService.save();
    }
    res.status(200).json({ message: "Title and description updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating title and description." });
  }
});

module.exports = router;
