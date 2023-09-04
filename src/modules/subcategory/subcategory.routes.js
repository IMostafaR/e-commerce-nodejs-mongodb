import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";

export const subcategoryRouter = Router();

subcategoryRouter.route("/").get().post(subcategory.create);

subcategoryRouter.route("/:id").get().put(subcategory.update).delete();
