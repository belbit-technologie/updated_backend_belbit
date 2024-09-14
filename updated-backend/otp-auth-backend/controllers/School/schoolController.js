const { addOrUpdateSchoolDetails } = require('../../services/School/schoolService');

const submitSchoolDetails = async (req, res) => {
  const { mobileNumber, schoolname, ownername, email, password, number, address, city, state, pincode, certificate, license } = req.body;

  if (!mobileNumber || !schoolname || !ownername || !email || !password || !number || !address || !city || !state || !pincode || !certificate || !license) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  try {
    const result = await addOrUpdateSchoolDetails(req.body);

    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in submitSchoolDetails:', error.message);
    return res.status(500).json({ status: 'error', message: 'Failed to submit school details' });
  }
};



module.exports = {
  submitSchoolDetails
};
