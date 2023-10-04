import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import {
  addToCart,
  applyCouponToCart,
  deleteCart,
  deleteProductFromCart,
  getCart,
} from "./cart.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  addToCartValidation,
  applyCouponToCartValidation,
  deleteCartValidation,
  deleteProductFromCartValidation,
  getCartValidation,
} from "./cart.validator.js";

export const cartRouter = Router();

cartRouter
  .route("/")
  .get(validation(getCartValidation), authenticate, getCart)
  .post(validation(addToCartValidation), authenticate, addToCart)
  .patch(
    validation(deleteProductFromCartValidation),
    authenticate,
    deleteProductFromCart
  )
  .delete(validation(deleteCartValidation), authenticate, deleteCart)
  .put(
    validation(applyCouponToCartValidation),
    authenticate,
    applyCouponToCart
  );
