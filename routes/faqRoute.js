const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// Get all FAQs
router.get('/', faqController.getAllFAQs);

// Get a FAQ by ID
router.get('/:id', faqController.getFAQById);

// Create a new FAQ
router.post('/', faqController.createFAQ);

// Update a FAQ
router.put('/:id', faqController.updateFAQ);

// Delete a FAQ
router.delete('/:id', faqController.deleteFAQ);

module.exports = router;
