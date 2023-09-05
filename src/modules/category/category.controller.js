import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { AppError } from "../../utils/error/appError.js";
import cloudinary from "../../utils/cloud/cloud.js";
import {
  createOne,
  handleAll,
  handleOne,
} from "../../utils/handler/refactor.handler.js";

/**
 * create new category
 */
const createCategory = createOne(Category);

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
const getAllCategories = handleAll(Category);

/**
 * Get a specific category by its id from DB
 */
const getOneCategory = handleOne(Category);

/**
 * Delete a specific category by its id from DB
 */
const deleteOneCategory = handleOne(Category);

export {
  createCategory,
  updateCategory,
  getAllCategories,
  getOneCategory,
  deleteOneCategory,
};
