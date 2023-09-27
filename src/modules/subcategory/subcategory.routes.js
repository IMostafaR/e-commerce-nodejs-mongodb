import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createSubcategoryValidation,
  deleteOneSubcategoryValidation,
  getOneSubcategoryValidation,
  updateSubcategoryValidation,
} from "./subcategory.validator.js";
import { authenticate, authorize } from "../auth/auth.controller.js";

export const subcategoryRouter = Router({ mergeParams: true });

// Define routes for managing subcategories
subcategoryRouter
  .route("/")
  .get(subcategory.getAllSubcategories)
  .post(
    validation(createSubcategoryValidation),
    authenticate,
    authorize("admin"),
    subcategory.createSubcategory
  );

subcategoryRouter
  .route("/:id")
  .get(validation(getOneSubcategoryValidation), subcategory.getOneSubcategory)
  .put(
    validation(updateSubcategoryValidation),
    authenticate,
    authorize("admin"),
    subcategory.updateSubcategory
  )
  .delete(
    validation(deleteOneSubcategoryValidation),
    authenticate,
    authorize("admin"),
    subcategory.deleteOneSubcategory
  );
