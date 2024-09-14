const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true, unique: true },
  name: { type: String },
  gender: { type: String },
  disabilityStatus: { type: String },
  otpVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
