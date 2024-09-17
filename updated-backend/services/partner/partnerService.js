
const Partner = require('../../models/partner/common/partnerSchema');

const updateIndividualType = async (mobileNumber, individualType) => {
  try {
    const partner = await Partner.findOneAndUpdate(
      { mobileNumber }, 
      { individualType },
      { new: true } 
    );
    return partner;
  } catch (error) {
    throw new Error('Error updating individual type: ' + error.message);
  }
};

module.exports = {
  updateIndividualType,
};
