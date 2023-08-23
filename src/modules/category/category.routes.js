import { Router } from "express";
import { category } from "./category.controller.js";
import {
  uploadFileCloud,
  fileValidation,
} from "../../utils/upload/multerCloud.js";

export const categoryRouter = Router();

// add category

categoryRouter.post(
  "/",
  uploadFileCloud({
    fileType: fileValidation.image,
  }).single("image"),
  category.add
);
