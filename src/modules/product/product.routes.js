import { Router } from "express";
import {
  fileValidation,
  uploadFileCloud,
} from "../../utils/upload/multerCloud.js";
import * as product from "./product.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createProductValidation,
  deleteOneProductValidation,
  getOneProductValidation,
} from "./product.validator.js";
import { authenticate, authorize } from "../auth/auth.controller.js";

export const productRouter = Router();

productRouter
  .route("/")
  .get(product.getAllProducts)
  .post(
    uploadFileCloud({ fileType: fileValidation.image }).single("mainImage"),
    validation(createProductValidation),
    authenticate,
    authorize("admin"),
    product.createProduct
  );

productRouter
  .route("/:id")
  .get(validation(getOneProductValidation), product.getOneProduct)
  .put(
    uploadFileCloud({ fileType: fileValidation.image }).single("mainImage"),
    authenticate,
    authorize("admin"),
    product.updateProduct
  )
  .delete(
    validation(deleteOneProductValidation),
    authenticate,
    authorize("admin"),
    product.deleteOneProduct
  );
