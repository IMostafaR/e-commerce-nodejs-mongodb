import { Router } from "express";
import { user } from "./user.controller.js";
import { userValidatorSchema } from "./user.validator.js";
import { validation } from "../../middleware/validation/validation.js";

export const userRouter = Router();

// signup
userRouter.post("/signup", validation(userValidatorSchema.signup), user.signup);

// verify Email
userRouter.get(
  "/verifyEmail/:token",
  validation(userValidatorSchema.verifyEmail),
  user.verifyEmail
);

// resend Verification Email
userRouter.get("/resendEmail/:refreshToken", user.resendVerificationEmail);

// login

userRouter.post("/login", validation(userValidatorSchema.login), user.login);
