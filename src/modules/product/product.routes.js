import { Router } from "express";
import {
  fileValidation,
  uploadFileCloud,
} from "../../utils/upload/multerCloud.js";
import * as product from "./product.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import { handleOneProductValidation } from "./product.validator.js";

export const productRouter = Router();

productRouter
  .route("/")
  .get(product.getAllProducts)
  .post(
    uploadFileCloud({ fileType: fileValidation.image }).single("mainImage"),
    product.createProduct
  );

productRouter
  .route("/:id")
  .get(validation(handleOneProductValidation), product.getOneProduct)
  .put(
    uploadFileCloud({ fileType: fileValidation.image }).single("mainImage"),
    product.updateProduct
  )
  .delete(validation(handleOneProductValidation), product.deleteOneProduct);
