import { Router } from "express";
import * as brand from "./brand.controller.js";
import {
  fileValidation,
  uploadFileCloud,
} from "../../utils/upload/multerCloud.js";

export const brandRouter = Router();

brandRouter
  .route("/")
  .get(brand.getAll)
  .post(
    uploadFileCloud({ fileType: fileValidation.image }).single("logo"),
    brand.create
  );

brandRouter
  .route("/:id")
  .get(brand.getOne)
  .put(
    uploadFileCloud({ fileType: fileValidation.image }).single("logo"),
    brand.update
  )
  .delete(brand.deleteOne);
