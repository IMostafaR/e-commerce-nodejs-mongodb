import { Router } from "express";
import { authenticate } from "../auth/auth.controller.js";
import { createCart } from "./cart.controller.js";

export const cartRouter = Router();

cartRouter.route("/").get().post(authenticate, createCart);
