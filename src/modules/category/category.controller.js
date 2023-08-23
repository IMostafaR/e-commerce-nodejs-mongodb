import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { AppError } from "../../utils/error/appError.js";
export const category = {
  add: catchAsyncError(async (req, res, next) => {
    const { name } = req.body;
    const image = req.file.path;

    const existingCategory = await Category.findOne({ name });

    existingCategory && next(new AppError("Category already exists", 409));

    const slug = slugify(name);

    const newCategory = new Category({ name, slug, image });

    const addedCategory = await newCategory.save();

    res.status(201).json({
      status: "success",
      message: "Category added successfully",
      data: addedCategory,
    });
  }),
};
