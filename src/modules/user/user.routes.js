import { Router } from "express";
import * as user from "./user.controller.js";
import { userValidatorSchema } from "./user.validator.js";
import { validation } from "../../middleware/validation/validation.js";
import { auth } from "../../middleware/auth/auth.js";

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

// logout

userRouter.patch(
  "/logout",
  validation(userValidatorSchema.logout),
  auth,
  user.logout
);

// send reset password code
userRouter.patch(
  "/resetCode",
  validation(userValidatorSchema.resetPassCode),
  user.resetPassCode
);

// reset password
userRouter.patch(
  "/resetPassword",
  validation(userValidatorSchema.resetPassword),
  user.resetPassword
);
