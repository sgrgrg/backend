const Enrollment = require('../models/Enrollment');

// Enroll a user in a training
const enrollUser = async (req, res) => {
  const { userId, trainingId } = req.body;
  try {
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, training: trainingId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User already enrolled in this training' });
    }
    const enrollment = new Enrollment({ user: userId, training: trainingId });
    const savedEnrollment = await enrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get enrollments for a user
const getUserEnrollments = async (req, res) => {
  const userId = req.params.userId;
  try {
    const enrollments = await Enrollment.find({ user: userId }).populate('training');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enrollUser,
  getUserEnrollments,
};
