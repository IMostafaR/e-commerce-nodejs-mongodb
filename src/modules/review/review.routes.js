import { Router } from "express";
import { createReview } from "./review.controller.js";
import { authenticate } from "../auth/auth.controller.js";

export const reviewRouter = Router();

reviewRouter.route("/").get().post();

reviewRouter.route("/:id").get().put().delete(authenticate, createReview);
