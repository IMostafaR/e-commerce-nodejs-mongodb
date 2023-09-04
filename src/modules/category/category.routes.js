import { Router } from "express";
import * as category from "./category.controller.js";
import {
  uploadFileCloud,
  fileValidation,
} from "../../utils/upload/multerCloud.js";

export const categoryRouter = Router();

categoryRouter
  .route("/")
  /**
   * Get all categories from DB
   */
  .get(category.getAll)
  /**
   * create new category route
   */
  .post(
    uploadFileCloud({
      fileType: fileValidation.image,
    }).single("image"),
    category.create
  );

categoryRouter
  .route("/:id")
  /**
   * Get a specific category with its id from DB
   */
  .get(category.getOne)
  /**
   * update existing category route
   */
  .put(
    uploadFileCloud({
      fileType: fileValidation.image,
    }).single("image"),
    category.update
  )
  /**
   * Delete a specific category by its id from DB
   */
  .delete(category.deleteOne);
