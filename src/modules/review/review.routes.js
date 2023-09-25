import { Router } from "express";
import { createReview, getAllReviews } from "./review.controller.js";
import { authenticate } from "../auth/auth.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import { createReviewValidation } from "./review.validator.js";

export const reviewRouter = Router();

reviewRouter.route("/").get(getAllReviews);

reviewRouter
  .route("/:id")
  .post(validation(createReviewValidation), authenticate, createReview)
  .get()
  .put()
  .delete();
