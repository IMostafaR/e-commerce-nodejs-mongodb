import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createSubcategoryValidation,
  updateSubcategoryValidation,
} from "./subcategory.validator.js";

export const subcategoryRouter = Router({ mergeParams: true });

subcategoryRouter
  .route("/")
  .get(subcategory.getAllSubcategories)
  .post(validation(createSubcategoryValidation), subcategory.createSubcategory);

subcategoryRouter
  .route("/:id")
  .get(subcategory.getOneSubcategory)
  .put(validation(updateSubcategoryValidation), subcategory.updateSubcategory)
  .delete(subcategory.deleteOneSubcategory);
