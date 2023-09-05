import slugify from "slugify";
import { Brand } from "../../../database/models/brand.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import cloudinary from "../../utils/cloud/cloud.js";

/**
 * create new brnad
 */

const create = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) return next(new AppError("Brand already exists", 404));

  const slug = slugify(name);

  const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
    folder: `E-commerce-40/brands/${slug}`,
  });

  const { secure_url, public_id } = cloudUpload;

  const newBrand = await Brand.create({
    name,
    slug,
    logo: { secure_url, public_id },
  });

  res.status(201).json({
    status: "success",
    message: "Brand added successfully",
    data: newBrand,
  });
});

/**
 * update existing brand
 */
const update = catchAsyncError(async (req, res, next) => {
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
const getAll = catchAsyncError(async (req, res, next) => {
  const brands = await Brand.find({});

  if (!brands.length)
    return next(new AppError("There's no brands added to the DB yet.", 404));

  res.status(200).json({
    status: "success",
    data: brands,
  });
});

/**
 * Get a specific brand by its id from DB
 */
const getOne = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);

  if (!brand)
    return next(
      new AppError("No such brand with this id exists in the DB", 404)
    );

  res.status(200).json({
    status: "success",
    data: brand,
  });
});

/**
 * Delete a specific category by its id from DB
 */
const deleteOne = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const deletedBrand = await Brand.findByIdAndDelete(id);

  if (!deletedBrand)
    return next(
      new AppError("No such brand with this id exists in the DB", 404)
    );

  res.status(200).json({
    status: "success",
    message: `${deletedBrand.name} category successfully deleted`,
  });
});

export { create, update, getAll, getOne, deleteOne };
