const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Partner = require('../../models/partner/partnerSchema');  

dotenv.config();

const SEND_OTP_URL = 'https://auth.otpless.app/auth/otp/v1/send';
const VERIFY_OTP_URL = 'https://auth.otpless.app/auth/otp/v1/verify';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// In-memory store for OTPs
const otpStore = {}; // { mobileNumber: { otp: '...', orderId: '...' } }

const sendOtpToPartner = async (mobileNumber) => {
  console.log(`Sending OTP to mobile number: ${mobileNumber}`);

  if (!mobileNumber) {
    return { status: 'error', message: 'Mobile number is mandatory' };
  }

  try {
    const response = await axios.post(SEND_OTP_URL, {
      phoneNumber: mobileNumber
    }, {
      headers: {
        'clientId': process.env.CLIENT_ID,
        'clientSecret': process.env.CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    });

    console.log('API response:', response.data);

    if (response.data.orderId) {
      // Store the orderId in memory
      otpStore[mobileNumber] = {
        orderId: response.data.orderId
      };

      console.log('OTP record saved in memory:', otpStore[mobileNumber]);
      return { status: 'success', message: 'OTP sent successfully' };
    } else {
      return { status: 'error', message: response.data.message || 'Failed to send OTP' };
    }
  } catch (error) {
    console.error('Error in sendOtpToPartner:', error.message);
    return { status: 'error', message: 'Error while sending OTP' };
  }
};

const verifyOtpToPartner = async (mobileNumber, otp) => {
  console.log(`Validating OTP for mobile number: ${mobileNumber}`);

  try {
    const otpRecord = otpStore[mobileNumber];
    if (!otpRecord) {
      return { status: 'error', message: 'Invalid mobile number or OTP not requested' };
    }

    const { orderId } = otpRecord;
    const requestBody = {
      orderId,
      otp,
      phoneNumber: mobileNumber
    };

    const response = await axios.post(VERIFY_OTP_URL, requestBody, {
      headers: {
        'clientId': process.env.CLIENT_ID,
        'clientSecret': process.env.CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.isOTPVerified) {
      // Remove OTP record after successful validation
      delete otpStore[mobileNumber];

      // Save mobile number to the `partner` collection
      try {
        const partnerRecord = new Partner({ mobileNumber });
        await partnerRecord.save();
        console.log('Partner record saved:', partnerRecord);
        return { status: 'success', message: 'OTP verified successfully and mobile number saved' };
      } catch (dbError) {
        console.error('Database error while saving partner record:', dbError.message);
        return { status: 'error', message: 'OTP verified but failed to save mobile number' };
      }
    } else {
      return { status: 'error', message: 'Invalid OTP' };
    }
  } catch (error) {
    console.error('Error in verifyOtpToPartner:', error.message);
    return { status: 'error', message: 'Error while verifying OTP' };
  }
};

module.exports = {
  sendOtpToPartner,
  verifyOtpToPartner,
};
