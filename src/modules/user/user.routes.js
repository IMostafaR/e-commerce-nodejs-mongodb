import { Router } from "express";
import { user } from "./user.controller.js";
import { userValidatorSchema } from "./user.validator.js";

export const userRouter = Router();

userRouter.post("/signup", validation(userValidatorSchema.signup), user.signup);
