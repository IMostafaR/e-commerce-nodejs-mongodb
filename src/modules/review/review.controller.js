import { Review } from "../../../database/models/review.model.js";
import { APIFeatures } from "../../utils/apiFeature/apiFeature.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { handleAll } from "../../utils/handler/refactor.handler.js";

const populateOptions = {
  path: "product customer",
  select: "_id firstName lastName name priceAfterDiscount brand",
};

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
    message: "Review successfully added.",
    data: newReview,
  });
});

/**
 * Get all reviews from the database.
 */
const getAllReviews = handleAll(Review, populateOptions);

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

export { createReview, getAllReviews, getProductReviews };
