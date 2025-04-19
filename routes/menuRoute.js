const express = require("express");
const multer = require("multer");
const { Menu, TitleDescribe } = require("../models/Menu");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Get all menu items and title/description
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.find();
    const titleDescribe = await TitleDescribe.findOne();
    res.json({ menuItems, titleDescribe });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu data" });
  }
});

// Update title and description
router.put("/title-describe", async (req, res) => {
  try {
    const { title, description } = req.body;
    const titleDescribe = await TitleDescribe.findOneAndUpdate(
      {},
      { title, description },
      { upsert: true, new: true }
    );
    res.json({ message: "Title and description updated", titleDescribe });
  } catch (err) {
    res.status(500).json({ error: "Failed to update title and description" });
  }
});

// Add new menu item
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file.path;

    const newMenuItem = new Menu({ name, price, image });
    await newMenuItem.save();

    const menuItems = await Menu.find();
    res.json({ message: "Menu item added", menuItems });
  } catch (err) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// Edit menu item
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedFields = { name, price };
    if (image) updatedFields.image = image;

    await Menu.findByIdAndUpdate(id, updatedFields, { new: true });

    const menuItems = await Menu.find();
    res.json({ message: "Menu item updated", menuItems });
  } catch (err) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete menu item
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);

    const menuItems = await Menu.find();
    res.json({ message: "Menu item deleted", menuItems });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// Toggle featured status
router.put("/toggle-featured/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const featuredItemsCount = await Menu.countDocuments({ featured: true });
    const menuItem = await Menu.findById(id);

    if (menuItem.featured || featuredItemsCount < 15) {
      menuItem.featured = !menuItem.featured;
      await menuItem.save();

      const menuItems = await Menu.find();
      res.json({ message: "Featured status updated", menuItems });
    } else {
      res.status(400).json({ error: "You can only select up to 15 featured items." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle featured status" });
  }
});

module.exports = router;
