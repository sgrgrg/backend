const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  location: { type: String },
  type: { type: String }, // e.g., Full-time, Part-time, Internship
  postedDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Career = mongoose.model('Career', careerSchema);

module.exports = Career;
