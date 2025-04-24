const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController');

// Change route path from '/upload' to '/' so full path is /api/upload
router.post('/', upload.single('file'), uploadImage);

module.exports = router;
