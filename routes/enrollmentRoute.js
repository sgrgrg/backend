const express = require('express');
const router = express.Router();
const { enrollUser, getUserEnrollments } = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Enroll a user in a training
router.post('/enroll', authMiddleware, enrollUser);

// Get enrollments for a user
router.get('/user/:userId', authMiddleware, getUserEnrollments);

module.exports = router;
