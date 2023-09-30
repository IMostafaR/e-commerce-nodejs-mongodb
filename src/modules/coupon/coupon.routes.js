import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.controller.js";
import { createCoupon } from "./coupon.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import { createCouponValidation } from "./coupon.validator.js";

export const couponRouter = Router();

couponRouter
  .route("/")
  .post(
    validation(createCouponValidation),
    authenticate,
    authorize("admin"),
    createCoupon
  );
