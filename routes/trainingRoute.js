const express = require('express');
const router = express.Router();
const {
  getTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  uploadTrainingImage,
} = require('../controllers/trainingController');
const adminMiddleware = require('../middleware/adminMiddleware');
const { upload } = require('../controllers/uploadController');

// Import enrollment routes
const enrollmentRoutes = require('./enrollmentRoute');

// Public routes
router.get('/', getTrainings);
router.get('/:id', getTrainingById);

// Admin routes
router.post('/', adminMiddleware, createTraining);
router.put('/:id', adminMiddleware, updateTraining);
router.delete('/:id', adminMiddleware, deleteTraining);

// Upload training image route
router.post('/:id/upload-image', adminMiddleware, upload.single('file'), uploadTrainingImage);

// Enrollment routes
router.use('/enrollments', enrollmentRoutes);

module.exports = router;
