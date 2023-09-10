import { Router } from "express";
import * as brand from "./brand.controller.js";
import {
  fileValidation,
  uploadFileCloud,
} from "../../utils/upload/multerCloud.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createBrandValidation,
  handleOneBrandValidation,
} from "./brand.validator.js";

export const brandRouter = Router();

brandRouter
  .route("/")
  .get(brand.getAllBrands)
  .post(
    uploadFileCloud({ fileType: fileValidation.image }).single("image"),
    validation(createBrandValidation),
    brand.createBrand
  );

brandRouter
  .route("/:id")
  .get(validation(handleOneBrandValidation), brand.getOneBrand)

  // TODO: apply validation rules after handling updating brand name logic in the controller (refactor handler)
  .put(
    uploadFileCloud({ fileType: fileValidation.image }).single("image"),
    brand.updateBrand
  )
  .delete(validation(handleOneBrandValidation), brand.deleteOneBrand);
