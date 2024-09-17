const  Router =require ('express');
// const User =require( '../models/');
const { sendOtpToPhone, validateOtp } =require ('../OtpServicesUser');
const generateJwtToken = require ('../../config/generateJwtToken');
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





export default router;
