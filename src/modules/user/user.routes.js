import { Router } from "express";
import { user } from "./user.controller.js";

export const userRouter = Router();

userRouter.post("/signup", validation(), user.signup);
