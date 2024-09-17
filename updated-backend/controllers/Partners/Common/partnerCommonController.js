
const { updateIndividualType } = require('../../../services/partner/partnerService');

const updateType = async (req, res) => {
  const { mobileNumber, individualType } = req.body;

  if (!mobileNumber || !individualType) {
    return res.status(400).json({ status: 'error', message: 'Mobile number and individual type are required' });
  }

  if (!['individualDriver', 'drivingSchoolOwner'].includes(individualType)) {
    return res.status(400).json({ status: 'error', message: 'Invalid individual type provided' });
  }

  try {
    const updatedPartner = await updateIndividualType(mobileNumber, individualType);

    if (updatedPartner) {
      return res.status(200).json({
        message: 'User type updated successfully',
        mobileNumber: updatedPartner.mobileNumber,
        individualType: updatedPartner.individualType,
      });
    } else {
      return res.status(404).json({ status: 'error', message: 'Partner not found' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  updateType,
};
