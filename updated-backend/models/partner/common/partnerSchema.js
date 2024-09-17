// models/partner/partnerModel.js
const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  individualType: {
    type: String,
    enum: ['individualDriver', 'drivingSchoolOwner'],
    default: null, 
  }
});

const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;
