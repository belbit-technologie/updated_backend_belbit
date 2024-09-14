const { sendOtpToPhone, validateOtp, saveUserDetails } = require('../services/otpService');

const sendOtp = async (req, res) => {
  const { mobileNumber } = req.body;
  console.log(`Received request to send OTP for mobile number: ${mobileNumber}`);

  try {
    const result = await sendOtpToPhone(mobileNumber);
    res.status(result.status === 'success' ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
  }
};

const verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;
  console.log(`Received request to validate OTP for mobile number: ${mobileNumber} with OTP: ${otp}`);

  try {
    const result = await validateOtp(mobileNumber, otp);
    if (result.status === 'success' && result.uuid) {
      res.status(200).json({
        message: 'OTP validated successfully',
        newUser: false,
        uuid: result.uuid
      });
    } else {
      res.status(result.status === 'pending_info' ? 200 : 400).json(result);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to verify OTP' });
  }
};

const submitDetails = async (req, res) => {
  const { mobileNumber, name, email, gender, age, password } = req.body;

  if (!mobileNumber || !name || !email || !gender || !age || !password) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  try {
    const result = await saveUserDetails(mobileNumber, { name, email, gender, age, password });
    res.status(result.status === 'success' ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error submitting details:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to submit details' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  submitDetails
};
