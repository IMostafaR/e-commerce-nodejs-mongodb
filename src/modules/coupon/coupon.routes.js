import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.controller.js";
import { createCoupon, deleteCoupon } from "./coupon.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createCouponValidation,
  deleteCouponValidation,
} from "./coupon.validator.js";

export const couponRouter = Router();

couponRouter
  .route("/")
  .post(
    validation(createCouponValidation),
    authenticate,
    authorize("admin"),
    createCoupon
  );

couponRouter
  .route("/:id")
  .delete(
    validation(deleteCouponValidation),
    authenticate,
    authorize("admin"),
    deleteCoupon
  );
