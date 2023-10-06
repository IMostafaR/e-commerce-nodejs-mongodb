import { User } from "../../../database/models/user.model.js";

/**
 * @desc    Get address from user address array by address ID
 * @param {String} user
 * @param {String} addressID
 * @returns {Object} { street, city, zipCode, country, phone }
 */
const getAddress = async (user, addressID) => {
  const userAddress = await User.findOne(
    {
      _id: user,
      "address._id": addressID,
    },
    {
      _id: 0,
      "address.$": 1,
    }
  );
  const { street, city, zipCode, country, phone } = userAddress.address[0];

  return { street, city, zipCode, country, phone };
};

export { getAddress };
