import { Router } from "express";
import * as auth from "./auth.controller.js";
import { authValidatorSchema } from "./auth.validator.js";
import { validation } from "../../middleware/validation/validation.js";
import { auth } from "../../middleware/auth/auth.js";

export const authRouter = Router();

// signup
authRouter.post("/signup", validation(authValidatorSchema.signup), auth.signup);

// verify Email
authRouter.get(
  "/verifyEmail/:token",
  validation(authValidatorSchema.verifyEmail),
  auth.verifyEmail
);

// resend Verification Email
authRouter.get("/resendEmail/:refreshToken", auth.resendVerificationEmail);

// login

authRouter.post("/login", validation(authValidatorSchema.login), auth.login);

// logout

authRouter.patch(
  "/logout",
  validation(authValidatorSchema.logout),
  auth,
  auth.logout
);

// send reset password code
authRouter.patch(
  "/resetCode",
  validation(authValidatorSchema.resetPassCode),
  auth.resetPassCode
);

// reset password
authRouter.patch(
  "/resetPassword",
  validation(authValidatorSchema.resetPassword),
  auth.resetPassword
);
