import { User } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

const populateOptions = {
  path: "wishlist",
  select: "name price mainImage.secure_url",
};

/**
 * @desc    Add product to user's wishlist
 */
const addWishlist = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.body;

  // check the length of wishlist and send error if it is full
  const user = await User.findById(id);
  if (user.wishlist.length === 25)
    return next(new AppError("Wishlist is full", 400));

  // add product to wishlist
  const productToWishlist = await User.findByIdAndUpdate(
    id,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true }
  ).populate(populateOptions);

  // Send response
  res.status(200).json({
    status: "success",
    message: "Product added to wishlist",
    total: productToWishlist.wishlist.length,
    data: productToWishlist.wishlist,
  });
});

/**
 * @desc    Get user's wishlist
 */
const getWishlist = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;

  // Get wishlist of user from database and populate it with product details
  const user = await User.findById(id).populate(populateOptions);

  // Check if wishlist is empty or not and send response accordingly
  if (!user.wishlist.length)
    return next(new AppError("Wishlist is empty", 404));

  // Send response
  res.status(200).json({
    status: "success",
    total: user.wishlist.length,
    data: user.wishlist,
  });
});

/**
 * @desc    Delete specific product from user's wishlist
 */
const deleteProductFromWishlist = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.body;

  // Delete product from wishlist
  const user = await User.findByIdAndUpdate(
    id,
    {
      $pull: { wishlist: productId },
    },
    { new: true }
  ).populate(populateOptions);

  // Send response
  res.status(200).json({
    status: "success",
    message: "Product deleted from wishlist",
    total: user.wishlist.length,
    data: user.wishlist,
  });
});

/**
 * @desc    Delete all products from user's wishlist
 */
const deleteAllWishlist = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;

  // Delete all products from wishlist
  const user = await User.findByIdAndUpdate(
    id,
    {
      $set: { wishlist: [] },
    },
    { new: true }
  ).populate(populateOptions);

  res.status(200).json({
    status: "success",
    message: "Wishlist deleted successfully",
    data: user.wishlist,
  });
});

export {
  addWishlist,
  getWishlist,
  deleteProductFromWishlist,
  deleteAllWishlist,
};
