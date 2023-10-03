import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import {
  addToCart,
  deleteCart,
  deleteProductFromCart,
  getCart,
} from "./cart.controller.js";

export const cartRouter = Router();

cartRouter
  .route("/")
  .get(authenticate, getCart)
  .post(authenticate, addToCart)
  .patch(authenticate, deleteProductFromCart)
  .delete(authenticate, deleteCart);
