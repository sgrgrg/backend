const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");

// Get all messages
router.get("/", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Create a new message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, content } = req.body;
    const newMessage = new Message({ name, email, subject, content });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reply to a message
router.patch("/:id/reply", async (req, res) => {
  const { id } = req.params;
  const { replyContent } = req.body;
  const message = await Message.findByIdAndUpdate(
    id,
    { replied: true, replyContent },
    { new: true }
  );
  res.json(message);
});

// Delete a message
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Message.findByIdAndDelete(id);
  res.json({ message: "Message deleted successfully" });
});

// Block an email
router.patch("/:id/block", async (req, res) => {
  const { id } = req.params;
  const message = await Message.findByIdAndUpdate(
    id,
    { blocked: true },
    { new: true }
  );
  res.json(message);
});

module.exports = router;
