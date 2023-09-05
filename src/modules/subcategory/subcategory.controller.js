import slugify from "slugify";
import { Subcategory } from "../../../database/models/subCategory.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

/**
 * create new subcategory
 */
const create = catchAsyncError(async (req, res, next) => {
  const { name, category } = req.body;

  const existingSubcategory = await Subcategory.findOne({ name });

  if (existingSubcategory)
    return next(new AppError("Subcategory already exists", 409));

  const slug = slugify(name);

  const newSubcategory = await Subcategory.create({ name, slug, category });

  res.status(201).json({
    status: "success",
    message: "Subcategory added successfully",
    data: newSubcategory,
  });
});

/**
 * update existing subcategory
 */
const update = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const existingSubcategory = await Subcategory.findById(id);

  if (!existingSubcategory)
    return next(
      new AppError(`Sorry, the subcategory with id ${id} cannot be found`, 404)
    );

  if (name) {
    const slug = slugify(name);
    existingSubcategory.name = name;
    existingSubcategory.slug = slug;
  }

  if (category) existingSubcategory.category = category;

  const updatedSubcategory = await existingSubcategory.save();

  res.status(200).json({
    status: "success",
    message: "Subcategory updated successfully",
    data: updatedSubcategory,
  });
});

/**
 * Get all subcategories from DB
 */
const getAll = catchAsyncError(async (req, res, next) => {
  const subcategories = await Subcategory.find({});

  if (!subcategories)
    return next(
      new AppError("There's not subcategories added to the DB yet", 404)
    );

  res.status(200).json({
    status: "success",
    data: subcategories,
  });
});

/**
 * Get a specific subcategory by its id from DB
 */
const getOne = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);

  if (!subcategory)
    return next(
      new AppError("No such subcategory with this id exists in the DB", 404)
    );

  res.status(200).json({
    status: "success",
    data: subcategory,
  });
});

/**
 * Delete a specific subcategory by its id from DB
 */
const deleteOne = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deletedSubcategory = await Subcategory.findByIdAndDelete(id);

  if (!deletedSubcategory)
    return next(
      new AppError("No such subcategory with this id exists in the DB", 404)
    );

  res.status(200).json({
    status: "success",
    message: `${deletedSubcategory.name} subcategory successfully deleted`,
  });
});

export { create, update, getAll, getOne, deleteOne };
