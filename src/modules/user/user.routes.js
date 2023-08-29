import { Router } from "express";
import { user } from "./user.controller.js";
import { userValidatorSchema } from "./user.validator.js";
import { validation } from "../../middleware/validation/validation.js";

export const userRouter = Router();

userRouter.post("/signup", validation(userValidatorSchema.signup), user.signup);

userRouter.get(
  "/verifyEmail/:token",
  validation(userValidatorSchema.verifyEmail),
  user.verifyEmail
);

userRouter.get("/resendEmail/:refreshToken", user.resendVerificationEmail);
