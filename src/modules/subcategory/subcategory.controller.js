import slugify from "slugify";
import { Subcategory } from "../../../database/models/subCategory.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { Category } from "../../../database/models/category.model.js";

/**
 * create new subcategory
 */
const createSubcategory = catchAsyncError(async (req, res, next) => {
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
const updateSubcategory = catchAsyncError(async (req, res, next) => {
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
 * Get all subcategories from DB or all subcategories of a category from DB
 */
const getAllSubcategories = catchAsyncError(async (req, res, next) => {
  const queryObj = {};
  req.params && req.params.id ? (queryObj.category = req.params.id) : null;

  const subcategories = await Subcategory.find(queryObj);

  if (!subcategories.length)
    return req.params && req.params.id
      ? (await Category.findById(req.params.id))
        ? next(
            new AppError("Subcategories are not found for this category", 404)
          )
        : next(
            new AppError("No such category with this id exists in the DB", 404)
          )
      : next(
          new AppError("There's no subcategories added to the DB yet.", 404)
        );

  res.status(200).json({
    status: "success",
    data: subcategories,
  });
});

/**
 * Get a specific subcategory by its id from DB
 */
const getOneSubcategory = catchAsyncError(async (req, res, next) => {
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
const deleteOneSubcategory = catchAsyncError(async (req, res, next) => {
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

export {
  createSubcategory,
  updateSubcategory,
  getAllSubcategories,
  getOneSubcategory,
  deleteOneSubcategory,
};
