const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  training: { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: true },
  enrolledAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
