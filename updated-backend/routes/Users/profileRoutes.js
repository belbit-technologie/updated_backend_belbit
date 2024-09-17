const express = require('express');
const {getUserProfile} = require('../../controllers/Users/RegisterControlers');


const router = express.Router();


router.get('/:mobileNumber',getUserProfile);

module.exports = router;
