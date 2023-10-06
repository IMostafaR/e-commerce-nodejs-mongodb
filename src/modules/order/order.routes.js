import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import { createOrderValidation } from "./order.validator.js";
import { createCashOrder } from "./order.controller.js";

export const orderRouter = Router();

orderRouter
  .route("/")
  .post(validation(createOrderValidation), authenticate, createCashOrder);
