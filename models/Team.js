const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String },
  photo: { type: String }, // URL or filename of photo
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
