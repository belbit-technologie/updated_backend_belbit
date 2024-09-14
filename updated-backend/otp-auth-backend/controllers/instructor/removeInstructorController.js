// controllers/Instructor/instructorRemovalController.js
const { removeInstructorFromSchool } = require('../../services/instructor/removeinstructorservice');

const removeInstructorDetails = async (req, res) => {
  const { schoolId, instructorId } = req.body;

  // Validate required fields
  if (!schoolId || !instructorId) {
    return res.status(400).json({ status: 'error', message: 'School ID and Instructor ID are required' });
  }

  try {
    const result = await removeInstructorFromSchool(schoolId, instructorId);

    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in removeInstructorDetails:', error.message);
    return res.status(500).json({ status: 'error', message: 'Failed to remove instructor details', details: error.message });
  }
};

module.exports = { removeInstructorDetails };
