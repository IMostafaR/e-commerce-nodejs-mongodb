import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

export const userValidatorSchema = {
  // signup schema
  signup: Joi.object({
    firstName: mainValidationSchema.firstName,
    lastName: mainValidationSchema.lastName,
    email: mainValidationSchema.email,
    password: mainValidationSchema.password,
    repeatPassword: mainValidationSchema.repeatPassword,
  }),

  // verifyEmail schema
  verifyEmail: Joi.object({
    token: mainValidationSchema.token,
  }),

  // resendVerificationEmail schema
  resendVerificationEmail: Joi.object({
    refreshToken: mainValidationSchema.token,
  }),
};
