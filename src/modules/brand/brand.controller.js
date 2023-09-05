import slugify from "slugify";
import { Brand } from "../../../database/models/brand.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import cloudinary from "../../utils/cloud/cloud.js";
import {
  createOne,
  handleAll,
  handleOne,
} from "../../utils/handler/refactor.handler.js";

/**
 * create new brnad
 */

const createBrand = createOne(Brand);

/**
 * update existing brand
 */
const updateBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const existingBrand = await Brand.findById(id);

  if (!existingBrand)
    return next(
      new AppError(`Sorry, the brand with id ${id} is not exist`, 404)
    );

  // TODO: update brand name and slug
  // TODO: when updating brand name and slug, you should also update folders names in clouninary

  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    public_id: existingBrand.logo.public_id,
  });
  existingBrand.logo.secure_url = secure_url;

  const updatedBrand = await existingBrand.save();

  res.status(200).json({
    status: "success",
    message: "Brand image updated successfully",
    data: updatedBrand,
  });
});

/**
 * Get all brands from DB
 */
const getAllBrands = handleAll(Brand);

/**
 * Get a specific brand by its id from DB
 */
const getOneBrand = handleOne(Brand);

/**
 * Delete a specific brand by its id from DB
 */
const deleteOneBrand = handleOne(Brand);

export { createBrand, updateBrand, getAllBrands, getOneBrand, deleteOneBrand };
