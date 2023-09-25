import { Review } from "../../../database/models/review.model.js";
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

export { createReview, getAllReviews };
