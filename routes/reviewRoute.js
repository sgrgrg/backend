const express = require('express');
const multer = require('multer');
const Review = require('../models/Review');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Create a new review
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const review = new Review({
      name,
      rating,
      comment,
      image: req.file ? req.file.path : null,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, rating, comment, isFeatured } = req.body;
    const updatedData = {
      name,
      rating,
      comment,
      isFeatured,
      image: req.file ? req.file.path : undefined,
    };
    const review = await Review.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle feature/unfeature
router.patch('/:id/toggle-feature', async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      review.isFeatured = !review.isFeatured; // Toggle the value
      await review.save(); // Save the updated review
      res.status(200).json(review); // Return the updated review
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;

