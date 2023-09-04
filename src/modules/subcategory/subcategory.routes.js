import { Router } from "express";

export const subcategoryRouter = Router();

subcategoryRouter.route("/").get().post();

subcategoryRouter.route("/:id").get().put().delete();
