// services/School/schoolService.js
const School = require('../../models/School/School');
const Partner = require('../../models/partner/partnerSchema');

const addOrUpdateSchoolDetails = async (data) => {
  try {
    const { mobileNumber, schoolname, ownername, email, password, number, address, city, state, pincode, certificate, license } = data;

    // Check if the school record already exists for the given mobileNumber
    let school = await School.findOne({ mobileNumber });

    if (school) {
      // Update existing record
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
      // Create new record with a generated UUID
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

    // Update Partner collection with individualType if necessary
    await Partner.findOneAndUpdate({ mobileNumber }, { individualType: 'drivingSchoolOwner' }, { new: true });

    return { status: 'success', message: 'School details saved successfully', uuid: school.uuid };
  } catch (error) {
    console.error('Error in addOrUpdateSchoolDetails:', error.message);
    return { status: 'error', message: 'Failed to save school details' };
  }
};

module.exports = {
  addOrUpdateSchoolDetails
};
