const express = require('express');
const { submitSchoolDetails } = require('../../../controllers/School/schoolController');


const router = express.Router();

router.post('/submit-school-details', submitSchoolDetails);

module.exports = router;
