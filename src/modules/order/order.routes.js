import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import { validation } from "../../middleware/validation/validation.js";

export const orderRouter = Router();

orderRouter.route("/").post(authenticate);
