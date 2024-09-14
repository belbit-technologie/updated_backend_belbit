const { sendOtpToPartner, verifyOtpToPartner } = require('../../services/partner/otpServicePartner');


const sendOtp = async (req, res) => {
  const { mobileNumber } = req.body;
  console.log(`Received request to send OTP for mobile number: ${mobileNumber}`);

  if (!mobileNumber) {
    return res.status(400).json({ status: 'error', message: 'Mobile number is mandatory' });
  }

  try {
    const result = await sendOtpToPartner(mobileNumber);
    if (result.status === 'success') {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
  }
};


const verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;
  console.log(`Received request to validate OTP for mobile number: ${mobileNumber} with OTP: ${otp}`);

  if (!mobileNumber || !otp) {
    return res.status(400).json({ status: 'error', message: 'Mobile number and OTP are required' });
  }

  try {
    const result = await verifyOtpToPartner(mobileNumber, otp);
    
    if (result.status === 'success') {
      return res.status(200).json({
        message: 'OTP validated successfully',
        newUser: false,
        uuid: result.uuid || null,
 mobileNumber:mobileNumber       
      });
    } else {
      
      return res.status(result.status === 'pending_info' ? 200 : 400).json(result);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    return res.status(500).json({ status: 'error', message: 'Failed to verify OTP' });
  }
};


module.exports = {
  sendOtp,
  verifyOtp
};
