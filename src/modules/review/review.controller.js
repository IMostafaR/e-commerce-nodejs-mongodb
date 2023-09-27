import { Review } from "../../../database/models/review.model.js";
import { APIFeatures } from "../../utils/apiFeature/apiFeature.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { handleAll } from "../../utils/handler/refactor.handler.js";

/**
 * Create a new review based on the provided request body fields.
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If the customer has already reviewed this product, it returns a 409 Conflict error.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const createReview = catchAsyncError(async (req, res, next) => {
  const { title, content, rate } = req.body;
  const { id: product } = req.params;
  const { id: customer } = req.user;

  // TODO: Check if customer has already purchased this product (using orders)

  // check if the customer has already reviewed this product
  const existingReview = await Review.findOne({ customer, product });
  if (existingReview) {
    return next(new AppError("You've already reviewed this product", 409));
  }

  // Create a new review and save it into the database
  const newReview = await Review.create({
    title,
    content,
    rate,
    product,
    customer,
  });

  // Send a successful response
  res.status(201).json({
    status: "success",
    message: "Thank you for reviewing this product",
    data: newReview,
  });
});

/**
 * update a specific review written by the current customer
 */
const updateReview = catchAsyncError(async (req, res, next) => {
  const { title, content, rate } = req.body;
  const { id } = req.params;
  const { id: customer } = req.user;

  // update the review with the provided fields
  const updateFields = {};
  if (title) updateFields.title = title;
  if (content) updateFields.content = content;
  if (rate) updateFields.rate = rate;

  // check if the review written by the current customer exists and update it
  const updatedReview = await Review.findOneAndUpdate(
    { customer, _id: id },
    updateFields,
    { new: true }
  );

  // if the review doesn't exist, return a 403 error
  if (!updatedReview)
    return next(new AppError("You can't update this review", 403));

  // Send a successful response
  res.status(200).json({
    status: "success",
    message: "Review updated successfully",
    data: updatedReview,
  });
});

/**
 * Get all reviews from the database.
 */
const getAllReviews = handleAll(Review);

/**
 * Get all reviews for a specific product from the database.
 */
const getProductReviews = catchAsyncError(async (req, res, next) => {
  const { id: product } = req.params;

  // Create an APIFeatures instance to apply pagination, filtering, sorting, search, and selection
  let features = new APIFeatures(Review.find({ product }), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .select();

  // Execute the Mongoose query & Get all reviews for the specified product
  const reviews = await features.mongooseQuery;

  // Handle cases where no reviews are found for the specified product
  if (!reviews.length)
    return next(new AppError("This product has not reviewed yet", 404));

  // Send the response with the retrieved reviews
  res.status(200).json({
    status: "success",
    page: features.page,
    limit: features.limit,
    results: reviews.length,
    data: reviews,
  });
});

/**
 * Delete a specific review by its id from DB (Admin only)
 */
const deleteOneReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Find the review by its id and delete it
  const review = await Review.findByIdAndDelete(id);

  // Handle cases where no review is found
  if (!review) return next(new AppError(`No review found with ID: ${id}`, 404));

  // Send the response with the deleted review
  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
  });
});

export {
  createReview,
  getAllReviews,
  getProductReviews,
  updateReview,
  deleteOneReview,
};
