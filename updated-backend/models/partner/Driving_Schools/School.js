const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generateUUID = () => {
  return (Math.random().toString(36) + '00000000000000000').slice(2, 9).toUpperCase();
};

// Instructor schema as a subdocument within School
const instructorSchema = new Schema({
  instructorId: {
    type: String,
    default: () => (Math.random().toString(36).slice(-8).toUpperCase()), // 8 alphanumeric digit ID
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  drivinglicense: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});


const schoolSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: generateUUID
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  schoolname: {
    type: String,
    required: true
  },
  ownername: {
    type: String,
    required: true    
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  certificate: { 
    type: String,
    required: true
  },
  license: { 
    type: String,
    required: true
  },
  instructors: [{ type: Schema.Types.ObjectId, ref: 'Instructor' }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('School', schoolSchema);
