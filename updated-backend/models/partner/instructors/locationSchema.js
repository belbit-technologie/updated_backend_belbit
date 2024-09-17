const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Location', locationSchema);
