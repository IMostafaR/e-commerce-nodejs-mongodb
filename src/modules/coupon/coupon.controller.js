import e from "express";
import { Coupon } from "../../../database/models/coupon.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

/**
 * @desc    Create new coupon with fixed discount amount and custom code entered by admin
 */
const createCoupon = catchAsyncError(async (req, res, next) => {
  // Get the id of the user who created the coupon
  const { id: createdBy, id: updatedBy } = req.user;
  // Get the coupon data from the request body
  let { code, expiresAt, discount, maxUse } = req.body;

  // Check if coupon with this code already exists
  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon)
    return next(new AppError("Coupon with this code already exists", 409));

  // Convert expiresAt to Date object
  expiresAt = new Date(expiresAt);
  // add 24 hours to expiresAt to set the expiry time to 11:59:59 PM of that day
  expiresAt.setHours(expiresAt.getHours() + 24);
  // convert expiresAt to milliseconds
  expiresAt = expiresAt.getTime();

  // Create new coupon
  const newCoupon = await Coupon.create({
    code,
    expiresAt,
    discount,
    maxUse,
    createdBy,
    updatedBy,
  });

  // send response
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    data: newCoupon,
  });
});

export { createCoupon };
