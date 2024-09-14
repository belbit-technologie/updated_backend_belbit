const { addInstructorToSchool } = require('../../services/instructor/instructorService');

const submitInstructorDetails = async (req, res) => {
  const { schoolId, name, email, password, number, address, city, state, pincode, image, drivinglicense, experience } = req.body;

  // Validate required fields (excluding schoolId)
  if (!name || !email || !password || !number || !address || !city || !state || !pincode || !image || !drivinglicense || !experience) {
    return res.status(400).json({ status: 'error', message: 'All fields except schoolId are required' });
  }

  try {
    // Call service to add instructor to the school or create independent instructor
    const result = await addInstructorToSchool(schoolId, req.body);
    
    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in submitInstructorDetails:', error.message);
    return res.status(500).json({ status: 'error', message: 'Failed to submit instructor details', details: error.message });
  }
};

module.exports = { submitInstructorDetails };
