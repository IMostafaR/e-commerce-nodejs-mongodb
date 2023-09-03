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
  "/",
  uploadFileCloud({
    fileType: fileValidation.image,
  }).single("image"),
  category.update
);
