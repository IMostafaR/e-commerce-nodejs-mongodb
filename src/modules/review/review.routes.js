import { Router } from "express";
import {
  createReview,
  deleteOneReview,
  getAllReviews,
  getProductReviews,
  updateReview,
} from "./review.controller.js";
import { authenticate, authorize } from "../auth/auth.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createReviewValidation,
  updateReviewValidation,
} from "./review.validator.js";

export const reviewRouter = Router();

reviewRouter.route("/").get(authenticate, authorize("admin"), getAllReviews);

reviewRouter
  .route("/:id")
  .post(validation(createReviewValidation), authenticate, createReview)
  .get(authenticate, getProductReviews)
  .put(validation(updateReviewValidation), authenticate, updateReview)
  .delete(authenticate, authorize("admin"), deleteOneReview);
