const Career = require('../models/Career');

// Get all careers
exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a career by ID
exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Career not found' });
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new career
exports.createCareer = async (req, res) => {
  const career = new Career({
    title: req.body.title,
    description: req.body.description,
    requirements: req.body.requirements,
    location: req.body.location,
    type: req.body.type,
    postedDate: req.body.postedDate,
  });

  try {
    const newCareer = await career.save();
    res.status(201).json(newCareer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a career
exports.updateCareer = async (req, res) => {
  try {
    const updatedCareer = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCareer) return res.status(404).json({ message: 'Career not found' });
    res.json(updatedCareer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a career
exports.deleteCareer = async (req, res) => {
  try {
    const deletedCareer = await Career.findByIdAndDelete(req.params.id);
    if (!deletedCareer) return res.status(404).json({ message: 'Career not found' });
    res.json({ message: 'Career deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
