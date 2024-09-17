// models/partner/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m', 
  },
});

// Create and export the model
const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
