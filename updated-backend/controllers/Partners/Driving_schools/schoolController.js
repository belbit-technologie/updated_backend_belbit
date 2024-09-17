
const School = require('../../../models/partner/Driving_Schools/School');
const Partner = require('../../../models/partner/common/partnerSchema');
const { addOrUpdateSchoolDetails } = require('../../services/School/schoolService');
const addOrUpdateSchoolDetails = async (data) => {
  try {
    const { mobileNumber, schoolname, ownername, email, password, number, address, city, state, pincode, certificate, license } = data;

    
    let school = await School.findOne({ mobileNumber });

    if (school) {
    
      school.schoolname = schoolname;
      school.ownername = ownername;
      school.email = email;
      school.password = password;
      school.number = number;
      school.address = address;
      school.city = city;
      school.state = state;
      school.pincode = pincode;
      school.certificate = certificate;
      school.license = license;
      school.updatedAt = Date.now();
    } else {
      
      school = new School({
        mobileNumber,
        schoolname,
        ownername,
        email,
        password,
        number,
        address,
        city,
        state,
        pincode,
        certificate,
        license,
        uuid: generateUUID()
      });
    }

    await school.save();

    
    await Partner.findOneAndUpdate({ mobileNumber }, { individualType: 'drivingSchoolOwner' }, { new: true });

    return { status: 'success', message: 'School details saved successfully', uuid: school.uuid };
  } catch (error) {
    console.error('Error in addOrUpdateSchoolDetails:', error.message);
    return { status: 'error', message: 'Failed to save school details' };
  }
};

const submitSchoolDetails = async (req, res) => {
  
const { mobileNumber, schoolname, ownername, email, password, number, address, city, state, pincode, certificate, license } = req.body;

  if (!mobileNumber || !schoolname || !ownername || !email || !password || !number || !address || !city || !state || !pincode || !certificate || !license) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  try {
    const result = await addOrUpdateSchoolDetails(req.body);

    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in submitSchoolDetails:', error.message);
    return res.status(500).json({ status: 'error', message: 'Failed to submit school details' });
  }


};

module.exports = {
  submitSchoolDetails ,addOrUpdateSchoolDetails

};





