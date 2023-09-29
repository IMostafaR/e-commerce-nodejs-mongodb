import { User } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

/**
 * @desc    Add address to user's address array
 */
const addAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { street, city, zipCode, country } = req.body;

  // check the length of address array and send error if it is full
  const user = await User.findById(id);
  if (user.address.length === 5)
    return next(new AppError("Address limit reached", 400));

  // add address to address array of user if it doesn't exist
  const newAddressToUser = await User.findOneAndUpdate(
    {
      _id: id,
      address: {
        $not: {
          $elemMatch: {
            street,
            city,
            zipCode,
            country,
          },
        },
      },
    },
    {
      $addToSet: { address: { street, city, zipCode, country } },
    },
    { new: true }
  ).populate("address");

  // Send error if address already exists
  if (!newAddressToUser)
    return next(new AppError("Address already exists", 409));

  // Send response
  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    total: newAddressToUser.address.length,
    data: newAddressToUser.address,
  });
});

/**
 * @desc    Get user's addresses
 */
const getAddresses = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;

  // Get addresses of user from database and populate it
  const user = await User.findById(id).populate("address");

  // Check if address list is empty or not and send response accordingly
  if (!user.address.length)
    return next(new AppError("Address list is empty", 404));

  // Send response
  res.status(200).json({
    status: "success",
    total: user.address.length,
    data: user.address,
  });
});

/**
 * @desc    Change default address of user from address array
 */
const changeDefaultAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { addressId } = req.body;

  // Change default address of user and unset default address of other addresses
  const user = await User.findByIdAndUpdate(
    id,
    {
      $set: { "address.$[new].default": true }, // the address which user want to set as default
      $unset: { "address.$[old].default": false }, // all other addresses
    },
    {
      arrayFilters: [
        { "new._id": addressId }, // the address which user want to set as default
        { "old._id": { $ne: addressId } }, // all other addresses
      ],
      new: true,
    }
  ).populate("address");

  // Send response
  res.status(200).json({
    status: "success",
    message: "Default address changed successfully",
    total: user.address.length,
    data: user.address,
  });
});

/**
 * @desc    Delete specific address from user's address array
 */
const deleteSingleAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { addressId } = req.body;

  // Delete address from address array
  const user = await User.findByIdAndUpdate(
    id,
    {
      $pull: { address: { _id: addressId } }, // embedded document
    },
    { new: true }
  ).populate("address");

  // Send response
  res.status(200).json({
    status: "success",
    message: "Address deleted successfully",
    total: user.address.length,
    data: user.address,
  });
});

/**
 * @desc    Delete all addresses from user's address array
 */
const deleteAllAddresses = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;

  // set address array to empty
  const user = await User.findByIdAndUpdate(
    id,
    {
      $set: { address: [] },
    },
    { new: true }
  );

  // Send response
  res.status(200).json({
    status: "success",
    message: "Addresses deleted successfully",
    data: user.address,
  });
});

export {
  addAddress,
  getAddresses,
  changeDefaultAddress,
  deleteSingleAddress,
  deleteAllAddresses,
};
