import { Router } from "express";
import { category } from "./category.controller.js";

export const categoryRouter = Router();

// add category

categoryRouter.post("/", category.add);
