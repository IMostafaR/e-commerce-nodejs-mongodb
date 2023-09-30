import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.controller.js";
import { createCoupon } from "./coupon.controller.js";

export const couponRouter = Router();

couponRouter.route("/").post(authenticate, authorize("admin"), createCoupon);
