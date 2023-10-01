import e from "express";
import { Coupon } from "../../../database/models/coupon.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { handleAll, handleOne } from "../../utils/handler/refactor.handler.js";

const populateOptions = {
  path: "createdBy updatedBy usedBy",
  select: "firstName lastName email role -_id",
};

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
  // add 24 hours to expiresAt to set the expiry time to 11:59:59 PM of that day. This works for YYYY-MM-DD format
  expiresAt.setHours(expiresAt.getHours() + 24);

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

/**
 * @desc    Update coupon
 */

const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let { expiresAt, discount, maxUse, active } = req.body;
  const { id: updatedBy } = req.user;

  // update coupon with the provided data
  const updateFields = {};
  updateFields.updatedBy = updatedBy;
  if (expiresAt) {
    expiresAt = new Date(expiresAt);
    expiresAt.setHours(expiresAt.getHours() + 24);
    updateFields.expiresAt = expiresAt;
  }
  if (discount) updateFields.discount = discount;
  if (maxUse) updateFields.maxUse = maxUse;
  if (active) updateFields.active = active;

  // find the coupon and update it
  const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateFields, {
    new: true,
  }).populate(populateOptions);

  if (!updatedCoupon)
    return next(new AppError("Coupon not found or already deleted", 404));

  // send response
  res.status(200).json({
    status: "success",
    message: "Coupon updated successfully",
    data: updatedCoupon,
  });
});

/**
 * @desc    Get all coupons
 */
const getAllCoupons = handleAll(Coupon, populateOptions);

/**
 * @desc    Get specific coupon
 */
const getOneCoupon = handleOne(Coupon, populateOptions);

/**
 * @desc    Delete coupon
 */
const deleteCoupon = handleOne(Coupon);

export {
  createCoupon,
  updateCoupon,
  getAllCoupons,
  getOneCoupon,
  deleteCoupon,
};
