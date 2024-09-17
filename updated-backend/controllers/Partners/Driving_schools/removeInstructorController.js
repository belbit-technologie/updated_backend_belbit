const School = require('../../../models/partner/Driving_Schools/School');
const Instructor = require('../../../models/partner/instructors/instructorSchema');

const removeInstructorDetails = async (req, res) => {
  const { schoolId, instructorId } = req.body;

  // Validate required fields
  if (!schoolId || !instructorId) {
    return res.status(400).json({ status: 'error', message: 'School ID and Instructor ID are required' });
  }

  try {
    console.log(`removeInstructorDetails called with schoolId: ${schoolId} and instructorId: ${instructorId}`);

    // Convert IDs to strings for consistent comparison
    const schoolIdStr = schoolId.toString();
    const instructorIdStr = instructorId.toString();

    // Find the school by its ID
    const school = await School.findById(schoolIdStr);

    if (!school) {
      console.log(`School with ID ${schoolIdStr} not found`);
      return res.status(400).json({ status: 'error', message: 'School not found' });
    }

    // Log the current instructors in the school
    console.log(`Current instructors in school: ${school.instructors.map(id => id.toString())}`);

    // Check if the instructor exists in the school's instructors array
    const instructorIndex = school.instructors.findIndex(id => id.toString() === instructorIdStr);

    if (instructorIndex === -1) {
      console.log(`Instructor with ID ${instructorIdStr} not found in school ${schoolIdStr}`);
      return res.status(400).json({ status: 'error', message: 'Instructor not found in this school' });
    }

    // Remove the instructor from the school's instructors array
    school.instructors.splice(instructorIndex, 1);
    console.log('Removed instructor ID from school document');

    // Save the updated school document
    await school.save();
    console.log('Saved updated school document');

    // Optionally, delete the instructor document from the Instructor collection
    await Instructor.findByIdAndDelete(instructorIdStr);
    console.log('Deleted instructor document');

    return res.status(200).json({ status: 'success', message: 'Instructor removed successfully' });
  } catch (error) {
    console.error('Error in removeInstructorDetails:', {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ status: 'error', message: 'Failed to remove instructor details', details: error.message });
  }
};

module.exports = { removeInstructorDetails };
