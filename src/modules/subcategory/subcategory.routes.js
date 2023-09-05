import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";

export const subcategoryRouter = Router({ mergeParams: true });

subcategoryRouter
  .route("/")
  .get(subcategory.getAllSubcategories)
  .post(subcategory.createSubcategory);

subcategoryRouter
  .route("/:id")
  .get(subcategory.getOneSubcategory)
  .put(subcategory.updateSubcategory)
  .delete(subcategory.deleteOneSubcategory);
