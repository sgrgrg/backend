const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin routes
router.post('/', adminMiddleware, createEvent);
router.put('/:id', adminMiddleware, updateEvent);
router.delete('/:id', adminMiddleware, deleteEvent);

module.exports = router;
