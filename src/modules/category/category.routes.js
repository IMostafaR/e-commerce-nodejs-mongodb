import { Router } from "express";
import * as category from "./category.controller.js";
import {
  uploadFileCloud,
  fileValidation,
} from "../../utils/upload/multerCloud.js";
import { subcategoryRouter } from "../subcategory/subcategory.routes.js";
import {
  createCategoryValidation,
  deleteOneCategoryValidation,
  getOneCategoryValidation,
} from "./category.validator.js";
import { validation } from "../../middleware/validation/validation.js";
import { authenticate, authorize } from "../auth/auth.controller.js";

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
    authenticate,
    authorize("admin"),
    category.createCategory
  );

categoryRouter
  .route("/:id")
  .get(validation(getOneCategoryValidation), category.getOneCategory)

  // TODO: apply validation rules after handling updating category name logic in the controller (refactor handler)
  .put(
    uploadFileCloud({
      fileType: fileValidation.image,
    }).single("image"),
    authenticate,
    authorize("admin"),
    category.updateCategory
  )
  .delete(
    validation(deleteOneCategoryValidation),
    authenticate,
    authorize("admin"),
    category.deleteOneCategory
  );
