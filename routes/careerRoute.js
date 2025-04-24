const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');

// Get all careers
router.get('/', careerController.getAllCareers);

// Get a career by ID
router.get('/:id', careerController.getCareerById);

// Create a new career
router.post('/', careerController.createCareer);

// Update a career
router.put('/:id', careerController.updateCareer);

// Delete a career
router.delete('/:id', careerController.deleteCareer);

module.exports = router;
