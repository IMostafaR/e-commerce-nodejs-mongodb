import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { AppError } from "../../utils/error/appError.js";
import cloudinary from "../../utils/cloud/cloud.js";
import { deleteOne, getOne } from "../../utils/handler/refactor.handler.js";

/**
 * create new category
 */
const createCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return next(new AppError("Category already exists", 409));
  }

  const slug = slugify(name);

  const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
    folder: `E-commerce-40/categories/${slug}`,
  });

  const { secure_url, public_id } = cloudUpload;

  const newCategory = await Category.create({
    name,
    slug,
    image: { secure_url, public_id },
  });

  res.status(201).json({
    status: "success",
    message: "Category added successfully",
    data: newCategory,
  });
});

/**
 * update existing category
 */
const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    return next(
      new AppError(`Sorry, the category with id ${id}  cannot be found`, 404)
    );
  }
  // TODO: update category name and slug
  // TODO: when updating category name and slug, you should also update folders names in clouninary
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    public_id: existingCategory.image.public_id,
  });

  existingCategory.image.secure_url = secure_url;

  const updatedCategory = await existingCategory.save();

  res.status(200).json({
    status: "success",
    message: "Category image updated successfully",
    data: updatedCategory,
  });
});

/**
 * Get all categories from DB
 */
const getAllCategories = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find({});

  if (!categories.length)
    return next(
      new AppError("There's no categories added to the DB yet.", 404)
    );

  res.status(200).json({
    status: "success",
    data: categories,
  });
});

/**
 * Get a specific category by its id from DB
 */
const getOneCategory = getOne(Category, "Category");

/**
 * Delete a specific category by its id from DB
 */
const deleteOneCategory = deleteOne(Category, "Category");

export {
  createCategory,
  updateCategory,
  getAllCategories,
  getOneCategory,
  deleteOneCategory,
};
