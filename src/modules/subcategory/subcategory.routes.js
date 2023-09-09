import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import { createSubcategoryValidation } from "./subcategory.validator.js";

export const subcategoryRouter = Router({ mergeParams: true });

subcategoryRouter
  .route("/")
  .get(subcategory.getAllSubcategories)
  .post(validation(createSubcategoryValidation), subcategory.createSubcategory);

subcategoryRouter
  .route("/:id")
  .get(subcategory.getOneSubcategory)
  .put(subcategory.updateSubcategory)
  .delete(subcategory.deleteOneSubcategory);
