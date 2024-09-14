import { Router } from 'express';
import User from '../models/User';
import { sendOtpToPhone, validateOtp } from '../services/otpService';
import generateJwtToken from '../config/generateJwtToken';
const router = Router();


router.post('/request-otp', async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    const response = await sendOtpToPhone(mobileNumber);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;
  try {
    const response = await validateOtp(mobileNumber, otp);

    if (response.status === 'success') {
      if (response.uuid) {

        const token = generateJwtToken({ id: response.uuid, mobileNumber });
        return res.status(200).json({
          message: 'OTP verified successfully. User logged in.',
          newUser: false,
          token
        });
      } else {
        
        return res.status(200).json({
          message: response.message,
          newUser: true
        });
      }
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.post('/submit-details', async (req, res) => {
  const { mobileNumber, name, email, gender, age, password } = req.body;

  try {

    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User details already submitted' });
    }

    
    const newUser = new User({ mobileNumber, name, email, gender, age, password });
    await newUser.save();

    
    const token = generateJwtToken({ id: newUser._id, mobileNumber });

    res.status(200).json({
      status: 'success',
      message: 'User details saved successfully',
      token
    });
  } catch (error) {
    console.error('Error saving user details:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to save user details' });
  }
});

export default router;
