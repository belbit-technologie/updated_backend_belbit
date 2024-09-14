const express = require('express');
const { submitInstructorDetails } = require('../../controllers/instructor/instructorController');
const {removeInstructorDetails} = require('../../controllers/instructor/removeInstructorController');
const router = express.Router();

router.post('/submit-instructor-details', submitInstructorDetails);
router.post('/remove-instructor', removeInstructorDetails);
module.exports = router;
