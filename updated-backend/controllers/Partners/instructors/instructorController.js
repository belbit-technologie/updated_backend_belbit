const School = require('../../../models/partner/Driving_Schools/School');
const Instructor = require('../../../models/partner/instructors/instructorSchema');
const updateLocationModal = require('../../../models/partner/instructors/locationSchema'); 

const submitInstructorDetails = async (req, res) => {
  const { schoolId, name, email, password, number, address, city, state, pincode, image, drivinglicense, experience } = req.body;

  // Validate required fields
  if (!name || !email || !password || !number || !address || !city || !state || !pincode || !image || !drivinglicense || !experience) {
    return res.status(400).json({ status: 'error', message: 'All fields except schoolId are required' });
  }

  try {
    console.log(`submitInstructorDetails called with schoolId: ${schoolId} and instructorData: ${JSON.stringify(req.body)}`);

    if (schoolId) {
      // Find the school by its ID
      console.log(`Attempting to find school with ID: ${schoolId}`);
      const school = await School.findById(schoolId);

      if (!school) {
        console.log(`School with ID ${schoolId} not found`);
        return res.status(400).json({ status: 'error', message: 'School not found' });
      }

      // Create a new instructor document
      const newInstructor = new Instructor(req.body);

      // Validate the new instructor data
      const validationError = newInstructor.validateSync();
      if (validationError) {
        console.log('Validation error:', validationError);
        return res.status(400).json({ status: 'error', message: 'Invalid instructor data', details: validationError.errors });
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

      return res.status(200).json({ status: 'success', message: 'Instructor added successfully', instructor: newInstructor });
    } else {
      // Create a new independent instructor document
      const newInstructor = new Instructor(req.body);

      // Validate the new instructor data
      const validationError = newInstructor.validateSync();
      if (validationError) {
        console.log('Validation error:', validationError);
        return res.status(400).json({ status: 'error', message: 'Invalid instructor data', details: validationError.errors });
      }

      // Save the new independent instructor
      await newInstructor.save();
      console.log('New independent instructor saved');

      return res.status(200).json({ status: 'success', message: 'Independent instructor added successfully', instructor: newInstructor });
    }
  } catch (error) {
    console.error('Error in submitInstructorDetails:', {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ status: 'error', message: 'Failed to submit instructor details', details: error.message });
  }
};


//locationserviescontrollers

const updateLocation = async (data) => {
  try {
    const { instructorId, latitude, longitude } = data;

    
    await updateLocationModal.findByIdAndUpdate(instructorId, {
      location: { latitude, longitude }
    });

    console.log(`Location updated for instructor ${instructorId}`);
  } catch (error) {
    console.error('Error updating location:', error.message);
  }
};


module.exports = { submitInstructorDetails,updateLocation };
