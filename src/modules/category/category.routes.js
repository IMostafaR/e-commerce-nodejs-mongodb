import { Router } from "express";
import * as category from "./category.controller.js";
import {
  uploadFileCloud,
  fileValidation,
} from "../../utils/upload/multerCloud.js";
import { subcategoryRouter } from "../subcategory/subcategory.routes.js";
import {
  createCategoryValidation,
  handleOneCategoryValidation,
} from "./category.validator.js";
import { validation } from "../../middleware/validation/validation.js";

export const categoryRouter = Router();

// merge params
categoryRouter.use("/:id/subcategories", subcategoryRouter);

// category routes
categoryRouter
  .route("/")
  .get(category.getAllCategories)
  .post(
    uploadFileCloud({
      fileType: fileValidation.image,
    }).single("image"),
    validation(createCategoryValidation),
    category.createCategory
  );

categoryRouter
  .route("/:id")
  .get(validation(handleOneCategoryValidation), category.getOneCategory)

  // TODO: apply validation rules after handling updating category name logic in the controller (refactor handler)
  .put(
    uploadFileCloud({
      fileType: fileValidation.image,
    }).single("image"),
    category.updateCategory
  )
  .delete(validation(handleOneCategoryValidation), category.deleteOneCategory);
