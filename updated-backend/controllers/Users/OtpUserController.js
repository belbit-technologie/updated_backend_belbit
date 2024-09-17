const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});


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
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  }
});

const Mobile = mongoose.model('Mobile', mobileSchema);

const OTP = {};


const sendOtpToPhone = async (mobileNumber) => {
  console.log(`Sending OTP to mobile number: ${mobileNumber}`);

  const otpUrl = 'https://auth.otpless.app/auth/otp/v1/send';
  const requestBody = {
    phoneNumber: mobileNumber,
    otpLength: 6,
    channel: 'SMS',
    expiry: 60
  };

  try {
    const response = await axios.post(otpUrl, requestBody, {
      headers: {
        'clientId': process.env.CLIENT_ID,
        'clientSecret': process.env.CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    });

    const { data } = response;
    if (data.error) {
      console.error('Error sending OTP:', data.error);
      return { status: 'error', message: 'Failed to send OTP' };
    }

    const orderId = data.orderId;
    OTP[mobileNumber] = orderId; 

    return { status: 'success', message: 'OTP sent successfully', orderId };
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return { status: 'error', message: 'Failed to send OTP' };
  }
};


const validateOtp = async (mobileNumber, otp) => {
  console.log(`Validating OTP for mobile number: ${mobileNumber}`);

  const orderId = OTP[mobileNumber];
  if (!orderId) {
    return { status: 'error', message: 'Invalid mobile number or OTP not requested' };
  }

  const validateUrl = 'https://auth.otpless.app/auth/otp/v1/verify';
  const requestBody = {
    orderId,
    otp,
    phoneNumber: mobileNumber
  };

  try {
    const response = await axios.post(validateUrl, requestBody, {
      headers: {
        'clientId': process.env.CLIENT_ID,
        'clientSecret': process.env.CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    });

    const { data } = response;
    if (data.isOTPVerified) {
      delete OTP[mobileNumber];

      const existingMobile = await Mobile.findOne({ mobileNumber });
      if (!existingMobile) {
        return {
          status: 'pending_info',
          message: 'OTP verified successfully. Please provide additional details (name, email, gender, age, password).'
        };
      } else {
        console.log('Mobile number already exists in the database');
        return {
          status: 'success',
          message: 'OTP validated successfully',
          uuid: existingMobile._id 
        };
      }
    } else {
      return { status: 'error', message: 'Invalid OTP' };
    }
  } catch (error) {
    console.error('Error validating OTP:', error.message);
    return { status: 'error', message: 'Failed to validate OTP' };
  }
};


const saveUserDetails = async (mobileNumber, userDetails) => {
  try {
    const user = await Mobile.findOneAndUpdate(
      { mobileNumber },
      { ...userDetails, verifiedAt: Date.now() },
      { new: true, upsert: true }
    );

    return { status: 'success', message: 'User details saved successfully', user };
  } catch (error) {
    console.error('Error saving user details:', error.message);
    return { status: 'error', message: 'Failed to save user details' };
  }
};


module.exports = { sendOtpToPhone, validateOtp, saveUserDetails };
