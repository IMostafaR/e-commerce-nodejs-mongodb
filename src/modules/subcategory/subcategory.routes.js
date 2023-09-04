import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";

export const subcategoryRouter = Router();

subcategoryRouter.route("/").get(subcategory.getAll).post(subcategory.create);

subcategoryRouter
  .route("/:id")
  .get(subcategory.getOne)
  .put(subcategory.update)
  .delete();
