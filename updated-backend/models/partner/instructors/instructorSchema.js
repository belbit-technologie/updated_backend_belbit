const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    type: Number, // Ensure this is a number type
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
    type: Number, // Ensure this is a number type
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
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  location: {
    latitude: Number,
    longitude: Number
  }
});

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;
