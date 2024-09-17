const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  verifiedAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  hasLearningLicense: {
    type: Boolean,
    required: true,
    default: false, 
  },
  licenseNumber: {
    type: String,
    required: function () {
      return this.hasLearningLicense; 
    },
  },
});


const Mobile = mongoose.models.Mobile || mongoose.model('Mobile', mobileSchema, 'mobiles');

module.exports = Mobile;
