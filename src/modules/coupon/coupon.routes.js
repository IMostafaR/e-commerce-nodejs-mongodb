import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.controller.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getOneCoupon,
} from "./coupon.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createCouponValidation,
  deleteCouponValidation,
} from "./coupon.validator.js";

export const couponRouter = Router();

couponRouter
  .route("/")
  .get(authenticate, authorize("admin"), getAllCoupons)
  .post(
    validation(createCouponValidation),
    authenticate,
    authorize("admin"),
    createCoupon
  );

couponRouter
  .route("/:id")
  .get(authenticate, authorize("admin"), getOneCoupon)
  .delete(
    validation(deleteCouponValidation),
    authenticate,
    authorize("admin"),
    deleteCoupon
  );
