const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/studentSuccessStoryController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Public routes
router.get('/', getStories);
router.get('/:id', getStoryById);

// Admin routes with image upload
router.post('/', adminMiddleware, upload.single('photo'), createStory);
router.put('/:id', adminMiddleware, upload.single('photo'), updateStory);
router.delete('/:id', adminMiddleware, deleteStory);

module.exports = router;
