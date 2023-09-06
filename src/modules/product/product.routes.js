import { Router } from "express";
import {
  fileValidation,
  uploadFileCloud,
} from "../../utils/upload/multerCloud.js";
import * as product from "./product.controller.js";

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
  .get(product.getOneProduct)
  .put(
    uploadFileCloud({ fileType: fileValidation.image }).single("mainImage"),
    product.updateProduct
  )
  .delete(product.deleteOneProduct);
