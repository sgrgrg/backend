const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  isFeatured: { type: Boolean, default: false }, 
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
