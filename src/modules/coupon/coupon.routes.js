import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.controller.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getOneCoupon,
  updateCoupon,
} from "./coupon.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createCouponValidation,
  deleteCouponValidation,
  updateCouponValidation,
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
  .put(
    validation(updateCouponValidation),
    authenticate,
    authorize("admin"),
    updateCoupon
  )
  .delete(
    validation(deleteCouponValidation),
    authenticate,
    authorize("admin"),
    deleteCoupon
  );
