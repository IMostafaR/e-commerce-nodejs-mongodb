import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { AppError } from "../../utils/error/appError.js";
import cloudinary from "../../utils/cloud/cloud.js";

export const category = {
  add: catchAsyncError(async (req, res, next) => {
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
  }),

  update: catchAsyncError(async (req, res, next) => {
    res.status(201).json({
      status: "success",
      message: "",
    });
  }),
};
