const mongoose = require('mongoose');

const studentSuccessStorySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  photo: { type: String, required: true }, // URL or path to uploaded image
  quote: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  courseTaken: { type: String, required: true },
}, { timestamps: true });

const StudentSuccessStory = mongoose.model('StudentSuccessStory', studentSuccessStorySchema);

module.exports = StudentSuccessStory;
