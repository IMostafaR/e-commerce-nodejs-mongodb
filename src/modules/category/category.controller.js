import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { AppError } from "../../utils/error/appError.js";
import cloudinary from "../../utils/cloud/cloud.js";

/**
 * create new category
 */
const create = catchAsyncError(async (req, res, next) => {
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
const update = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    return next(
      new AppError(`Sorry, the category with id ${id}  cannot be found`, 404)
    );
  }

  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    public_id: existingCategory.image.public_id,
  });

  existingCategory.image.secure_url = secure_url;

  const updatedCategory = await existingCategory.save();

  res.status(201).json({
    status: "success",
    message: "Category image updated successfully",
    data: updatedCategory,
  });
});

/**
 * Get all categories from DB
 */
const getAll = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find({});

  if (!categories)
    return next(
      new AppError("There's no categories added to the DB yet.", 404)
    );

  res.status(201).json({
    status: "success",
    data: categories,
  });
});

/**
 * Get a specific category by its id from DB
 */
const getById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category)
    return next(new AppError("No such category id exist in the DB", 404));

  res.status(201).json({
    status: "success",
    data: category,
  });
});

/**
 * Delete a specific category by its id from DB
 */
const deleteOne = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory)
    return next(
      new AppError("No such category with this id exist in the DB", 404)
    );

  res.status(201).json({
    status: "success",
    message: `${deletedCategory.name} category successfully deleted`,
  });
});

export { create, update, getAll, getById, deleteOne };
