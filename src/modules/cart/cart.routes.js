import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import { createCart, getCart } from "./cart.controller.js";

export const cartRouter = Router();

cartRouter.route("/").get(authenticate, getCart).post(authenticate, createCart);
