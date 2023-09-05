import slugify from "slugify";
import { Subcategory } from "../../../database/models/subCategory.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { Category } from "../../../database/models/category.model.js";
import { handleAll, handleOne } from "../../utils/handler/refactor.handler.js";

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
const getAllSubcategories = handleAll(Subcategory);

/**
 * Get a specific subcategory by its id from DB
 */
const getOneSubcategory = handleOne(Subcategory);

/**
 * Delete a specific subcategory by its id from DB
 */
const deleteOneSubcategory = handleOne(Subcategory);

export {
  createSubcategory,
  updateSubcategory,
  getAllSubcategories,
  getOneSubcategory,
  deleteOneSubcategory,
};
