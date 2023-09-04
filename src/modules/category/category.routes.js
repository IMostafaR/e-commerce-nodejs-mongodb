import { Router } from "express";
import * as category from "./category.controller.js";
import {
  uploadFileCloud,
  fileValidation,
} from "../../utils/upload/multerCloud.js";

export const categoryRouter = Router();

/**
 * create new category route
 */
categoryRouter.post(
  "/",
  uploadFileCloud({
    fileType: fileValidation.image,
  }).single("image"),
  category.create
);

/**
 * update existing category route
 */
categoryRouter.put(
  "/:id",
  uploadFileCloud({
    fileType: fileValidation.image,
  }).single("image"),
  category.update
);

/**
 * Get all categories from DB
 */
categoryRouter.get("/", category.getAll);

/**
 * Get a specific category with its id from DB
 */
categoryRouter.get("/:id", category.getOne);

/**
 * Delete a specific category by its id from DB
 */
categoryRouter.delete("/:id", category.deleteOne);
