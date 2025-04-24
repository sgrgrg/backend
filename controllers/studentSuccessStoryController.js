const StudentSuccessStory = require('../models/StudentSuccessStory');
const path = require('path');
const { deleteFile } = require('../utils/fileUtils');

// Get all student success stories
const getStories = async (req, res) => {
  try {
    const stories = await StudentSuccessStory.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get story by ID
const getStoryById = async (req, res) => {
  try {
    const story = await StudentSuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new story
const createStory = async (req, res) => {
  try {
    const { studentName, quote, rating, courseTaken } = req.body;
    let photo = '';

    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'Photo is required' });
    }

    const story = new StudentSuccessStory({
      studentName,
      photo,
      quote,
      rating,
      courseTaken,
    });

    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update story
const updateStory = async (req, res) => {
  try {
    const story = await StudentSuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const { studentName, quote, rating, courseTaken } = req.body;

    if (studentName) story.studentName = studentName;
    if (quote) story.quote = quote;
    if (rating) story.rating = rating;
    if (courseTaken) story.courseTaken = courseTaken;

    if (req.file) {
      // Delete old photo file if exists
      if (story.photo) {
        const oldPath = path.join(__dirname, '..', story.photo);
        deleteFile(oldPath);
      }
      story.photo = `/uploads/${req.file.filename}`;
    }

    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const story = await StudentSuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    // Delete photo file if exists
    if (story.photo) {
      const photoPath = path.join(__dirname, '..', story.photo);
      deleteFile(photoPath);
    }

    await story.remove();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
};
