const School = require('../../models/School/School');
const Instructor = require('../../models/Instructor/instructorSchema');

const addInstructorToSchool = async (schoolId, instructorData) => {
  try {
    console.log(`addInstructorToSchool called with schoolId: ${schoolId} and instructorData: ${JSON.stringify(instructorData)}`);

    if (schoolId) {
      // Find the school by its ID
      console.log(`Attempting to find school with ID: ${schoolId}`);
      const school = await School.findById(schoolId);
      
      if (!school) {
        console.log(`School with ID ${schoolId} not found`);
        return { status: 'error', message: 'School not found' };
      }

      // Create a new instructor document
      const newInstructor = new Instructor(instructorData);
      
      // Validate the new instructor data
      const validationError = newInstructor.validateSync();
      if (validationError) {
        console.log('Validation error:', validationError);
        return { status: 'error', message: 'Invalid instructor data', details: validationError.errors };
      }

      // Save the new instructor
      await newInstructor.save();
      console.log('New instructor saved');

      // Add the instructor's ID to the school's instructors array
      school.instructors.push(newInstructor._id);
      console.log('Added new instructor ID to school document');

      // Save the updated school document
      await school.save();
      console.log('Saved updated school document');

      return { status: 'success', message: 'Instructor added successfully', instructor: newInstructor };
    } else {
      // Create a new independent instructor document
      const newInstructor = new Instructor(instructorData);
      
      // Validate the new instructor data
      const validationError = newInstructor.validateSync();
      if (validationError) {
        console.log('Validation error:', validationError);
        return { status: 'error', message: 'Invalid instructor data', details: validationError.errors };
      }

      // Save the new independent instructor
      await newInstructor.save();
      console.log('New independent instructor saved');

      return { status: 'success', message: 'Independent instructor added successfully', instructor: newInstructor };
    }
  } catch (error) {
    console.error('Error in addInstructorToSchool:', {
      message: error.message,
      stack: error.stack,
    });
    return { status: 'error', message: 'Failed to add instructor', details: error.message };
  }
};

module.exports = { addInstructorToSchool };
