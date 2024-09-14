const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const otpController = require('./controllers/otpController');
const otpRoutes = require('./routes/partner/otpRoutes');
const partnerRoutes = require('./routes/partner/partnerRoutes');
const schoolRoutes = require('./routes/School/schoolRoutes');
const instructorRoutes = require('./routes/instructor/instructorRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.post('/sendOtp', otpController.sendOtp);
app.post('/verifyOtp', otpController.verifyOtp);
app.post('/submit-details', otpController.submitDetails);
app.use('/api/otp', otpRoutes);
app.use('/partner', partnerRoutes);
app.use('/school', schoolRoutes); 
app.use('/instructor', instructorRoutes);



// Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
