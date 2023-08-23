import { Router } from "express";
import { category } from "./category.controller.js";
import { fileValidation, uploadFile } from "../../utils/upload/multer.js";

export const categoryRouter = Router();

// add category

categoryRouter.post(
  "/",
  uploadFile({ folder: "categories", fileType: fileValidation.image }).single(
    "image"
  ),
  category.add
);
