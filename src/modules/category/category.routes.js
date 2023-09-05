import { Router } from "express";
import * as category from "./category.controller.js";
import {
  uploadFileCloud,
  fileValidation,
} from "../../utils/upload/multerCloud.js";
import { subcategoryRouter } from "../subcategory/subcategory.routes.js";

export const categoryRouter = Router();

// merge params
categoryRouter.use("/:id/subcategories", subcategoryRouter);

// category routes
categoryRouter
  .route("/")
  .get(category.getAll)
  .post(
    uploadFileCloud({
      fileType: fileValidation.image,
    }).single("image"),
    category.create
  );

categoryRouter
  .route("/:id")
  .get(category.getOne)
  .put(
    uploadFileCloud({
      fileType: fileValidation.image,
    }).single("image"),
    category.update
  )
  .delete(category.deleteOne);
