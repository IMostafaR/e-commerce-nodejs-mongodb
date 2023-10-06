import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createOrderValidation,
  getAllUserOrdersValidation,
} from "./order.validator.js";
import {
  createCashOrder,
  createOnlinePaymentSession,
  getAllUserOrders,
} from "./order.controller.js";

export const orderRouter = Router();

orderRouter
  .route("/")
  .post(validation(createOrderValidation), authenticate, createCashOrder)
  .get(validation(getAllUserOrdersValidation), authenticate, getAllUserOrders);

orderRouter
  .route("/checkout")
  .post(
    validation(createOrderValidation),
    authenticate,
    createOnlinePaymentSession
  );
