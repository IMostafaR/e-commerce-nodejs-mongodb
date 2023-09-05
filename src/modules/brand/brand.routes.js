import { Router } from "express";
import * as brand from "./brand.controller.js";
import {
  fileValidation,
  uploadFileCloud,
} from "../../utils/upload/multerCloud.js";

export const brandRouter = Router();

brandRouter
  .route("/")
  .get(brand.getAllBrands)
  .post(
    uploadFileCloud({ fileType: fileValidation.image }).single("logo"),
    brand.createBrand
  );

brandRouter
  .route("/:id")
  .get(brand.getOneBrand)
  .put(
    uploadFileCloud({ fileType: fileValidation.image }).single("logo"),
    brand.updateBrand
  )
  .delete(brand.deleteOneBrand);
