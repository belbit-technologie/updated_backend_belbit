// routes/partnerRoutes.js
const express = require('express');
const { updateType } = require('../../controllers/partner/partnerController');

const router = express.Router();

// POST route to update the individual type (e.g., individual driver or driving school owner)
router.post('/update-type', updateType);

module.exports = router;
