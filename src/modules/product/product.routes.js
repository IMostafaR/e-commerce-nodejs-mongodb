import { Router } from "express";
import {
  fileValidation,
  uploadFileCloud,
} from "../../utils/upload/multerCloud.js";
import * as product from "./product.controller.js";

export const productRouter = Router();

productRouter
  .route("/")
  .post(
    uploadFileCloud({ fileType: fileValidation.image }).single("mainImage"),
    product.createProduct
  );
