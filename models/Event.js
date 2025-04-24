const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
