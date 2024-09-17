
const User = require ('../models/User');
const Mobile =require( '../../models/User/mobileSchema'); 

const generateJwtToken = require ('../config/generateJwtToken');
  
  
  
  const  RegisterUser =async (req, res) => {
    const { mobileNumber, name, email, gender, age, hasLearningLicense, licenseNumber, password } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ mobileNumber });
      if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'User details already submitted' });
      }
  
      // Validate learning license input
      if (hasLearningLicense && !licenseNumber) {
        return res.status(400).json({ status: 'error', message: 'License number is required if learning license is yes' });
      }
  
      // Create and save new user
      const newUser = new User({ mobileNumber, name, email, gender, age, hasLearningLicense, licenseNumber, password });
      await newUser.save();
  
      // Generate JWT token
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
  }

  const getUserProfile = async (mobileNumber) => {
    try {
      const user = await Mobile.findOne({ mobileNumber });
      if (!user) {
        return { status: 'error', message: 'User not found' };
      }
  
      const profileData = {
        name: user.name,
        email: user.email,
        gender: user.gender,
        age: user.age,
        hasLearningLicense: user.hasLearningLicense,
      };
  
      if (user.hasLearningLicense) {
        profileData.licenseNumber = user.licenseNumber;
      }
  
      return { status: 'success', data: profileData };
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      return { status: 'error', message: 'Failed to retrieve profile' };
    }
  };


  module.exports = {getUserProfile,RegisterUser};