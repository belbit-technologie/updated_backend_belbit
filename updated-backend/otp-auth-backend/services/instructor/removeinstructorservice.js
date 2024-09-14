// services/instructor/instructorService.js (or instructorRemovalService.js)
const School = require('../../models/School/School');
const Instructor = require('../../models/Instructor/instructorSchema'); 

const removeInstructorFromSchool = async (schoolId, instructorId) => {
  try {
    console.log(`removeInstructorFromSchool called with schoolId: ${schoolId} and instructorId: ${instructorId}`);

    // Find the school by its ID
    const school = await School.findById(schoolId);

    if (!school) {
      console.log(`School with ID ${schoolId} not found`);
      return { status: 'error', message: 'School not found' };
    }

    // Check if the instructor exists in the school's instructors array
    if (!school.instructors.includes(instructorId)) {
      console.log(`Instructor with ID ${instructorId} not found in school ${schoolId}`);
      return { status: 'error', message: 'Instructor not found in this school' };
    }

    // Remove the instructor from the school's instructors array
    school.instructors.pull(instructorId);
    console.log('Removed instructor ID from school document');

    // Save the updated school document
    await school.save();
    console.log('Saved updated school document');

    // Optionally, delete the instructor document from the Instructor collection
    await Instructor.findByIdAndDelete(instructorId);
    console.log('Deleted instructor document');

    return { status: 'success', message: 'Instructor removed successfully' };
  } catch (error) {
    console.error('Error in removeInstructorFromSchool:', {
      message: error.message,
      stack: error.stack,
    });
    return { status: 'error', message: 'Failed to remove instructor from school', details: error.message };
  }
};

module.exports = { removeInstructorFromSchool };
