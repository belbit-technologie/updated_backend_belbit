const express = require('express');
const { submitInstructorDetails } = require('../../controllers/Instructor/instructorController');

const router = express.Router();

router.post('/submit-instructor-details', submitInstructorDetails);

module.exports = router;
