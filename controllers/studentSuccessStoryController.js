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

const deleteStory = async (req, res) => {
  console.log('Delete story request received for ID:', req.params.id);
  try {
    const story = await StudentSuccessStory.findById(req.params.id);
    if (!story) {
      console.log('Story not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Story not found' });
    }
    console.log('Story found:', story);

    // Delete photo file if exists
    if (story.photo) {
      const photoPath = path.resolve(__dirname, '..', '.' + story.photo);
      try {
        console.log('Attempting to delete photo file at:', photoPath);
        await deleteFile(photoPath);
      } catch (err) {
        console.error('Error deleting photo file:', err);
      }
    }

    try {
      await story.deleteOne();
      console.log('Story removed from database:', req.params.id);
    } catch (removeErr) {
      console.error('Error removing story from database:', removeErr);
      return res.status(500).json({ message: 'Failed to remove story from database' });
    }

    res.json({ message: 'Story deleted' });
  } catch (error) {
    console.error('Error in deleteStory controller:', error);
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
