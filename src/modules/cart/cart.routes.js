import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import {
  addToCart,
  deleteCart,
  deleteProductFromCart,
  getCart,
} from "./cart.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import { addToCartValidation, getCartValidation } from "./cart.validator.js";

export const cartRouter = Router();

cartRouter
  .route("/")
  .get(validation(getCartValidation), authenticate, getCart)
  .post(validation(addToCartValidation), authenticate, addToCart)
  .patch(authenticate, deleteProductFromCart)
  .delete(authenticate, deleteCart);
