const FAQ = require('../models/FAQ');

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a FAQ by ID
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new FAQ
exports.createFAQ = async (req, res) => {
  const faq = new FAQ({
    question: req.body.question,
    answer: req.body.answer,
  });

  try {
    const newFAQ = await faq.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFAQ) return res.status(404).json({ message: 'FAQ not found' });
    res.json(updatedFAQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFAQ) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
