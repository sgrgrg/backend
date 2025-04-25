const Training = require('../models/Training');

// Get all trainings
const getTrainings = async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get training by ID
const getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: 'Training not found' });
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new training
const createTraining = async (req, res) => {
  const { title, description, duration, fees, level } = req.body;
  const training = new Training({ title, description, duration, fees, level });
  try {
    const newTraining = await training.save();
    res.status(201).json(newTraining);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update training
const updateTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: 'Training not found' });

    const { title, description, duration, fees, level } = req.body;
    if (title) training.title = title;
    if (description) training.description = description;
    if (duration) training.duration = duration;
    if (fees) training.fees = fees;
    if (level) training.level = level;

    const updatedTraining = await training.save();
    res.json(updatedTraining);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const deletedTraining = await Training.findByIdAndDelete(req.params.id);
    if (!deletedTraining) return res.status(404).json({ message: 'Training not found' });

    res.json({ message: 'Training deleted' });
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ message: 'Failed to delete training', error: error.message });
  }
};

// Upload training image
const uploadTrainingImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: 'Training not found' });

    training.image = req.file.filename; // Assuming 'image' field in Training model
    const updatedTraining = await training.save();
    res.json(updatedTraining);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  uploadTrainingImage,
};
